'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { Row } from '@signalco/ui-primitives/Row';
import { Card, CardOverflow } from '@signalco/ui-primitives/Card';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { Loadable } from '@signalco/ui/Loadable';
import '@reactflow/core/dist/base.css';
import {
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    ReactFlow,
    Edge,
    Node,
    NodeProps,
    Handle,
    Position,
    ProOptions
} from '@reactflow/core';
import { Controls } from '@reactflow/controls';
import { Background } from '@reactflow/background';
import { usePromise, useResizeObserver } from '@enterwell/react-hooks';

type InfraResource = {
    id: string;
    urn: string;
    valid: false;
} | {
    id: string;
    urn: string;
    valid: true;
    source: string;
    project: string;
    stack: string;
    package: string;
    resourceType: string;
    name: string;
    dependencies?: InfraResource[];
    dependents?: InfraResource[];
    depth: number;
    totalChildren: number;
};

function ResourceCard({ data: resource }: NodeProps<InfraResource>) {
    return (
        <Card>
            <Handle type="target" position={Position.Left} />
            {resource.valid ? (
                <Row spacing={2}>
                    <Avatar title={resource.package}>{resource.package.substring(0, 2).toUpperCase()}</Avatar>
                    <Stack>
                        <Typography>{resource.name}</Typography>
                        <Typography level="body2">{resource.resourceType}</Typography>
                    </Stack>
                </Row>
            ) : (
                <div>{resource.urn}</div>
            )}
            <Handle type="source" position={Position.Right} />
        </Card>
    );
}

async function fetchInfrastructureGraph(stack: 'production' | 'next') {
    return await (await fetch(`/assets/infrastructure/graph-${stack}.gv`)).text();
}

const flowProOptions: ProOptions = {
    hideAttribution: true
};

function ResourceGraph() {
    const fetchInfrastructureCallback = useCallback(() => fetchInfrastructureGraph('next'), []);
    const { item, isLoading, error } = usePromise(fetchInfrastructureCallback);

    const [visibleResourceTypes, setVisibleResourceTypes] = useState<string[] | undefined>(['web:WebApp']);

    const resources: InfraResource[] = useMemo(() => {
        const resourceItems: InfraResource[] = [];
        const graphLines = item?.split('\n');

        // Calculate resources
        graphLines?.forEach((line) => {
            const matchLabel = line.match(/Resource([0-9]*) \[label="(.*)"\];/);
            if (matchLabel) {
                const [, id, urn] = matchLabel;
                if (!id || !urn) {
                    console.warn('Invalid resource', line);
                    return;
                }

                const urnMatch = urn?.match(/urn:([\w-]*):([\w-]*)::([\w-]*)::([\w-]*):(.*)::([\w-]*)/);
                if (urnMatch) {
                    const [, source, stack, project, packageName, resourceType, name] = urnMatch;
                    if (!source || !stack || !project || !packageName || !resourceType || !name) {
                        console.warn('Invalid urn', urn);
                        return;
                    }
                    resourceItems.push({
                        id, urn, valid: true, source, name, stack, project, package: packageName, resourceType,
                        depth: 0, totalChildren: 0
                    });
                } else {
                    resourceItems.push({ id, urn, valid: false });
                }
            }
        });

        // Calculate connections
        graphLines?.forEach((line) => {
            const matchEdge = line.match(/Resource([0-9]*) -> Resource([0-9]*)/);
            if (matchEdge) {
                const [, fromId, toId] = matchEdge;
                const fromResource = resourceItems.find((resource) => resource.id === fromId);
                const toResource = resourceItems.find((resource) => resource.id === toId);
                if (fromResource?.valid && toResource?.valid) {
                    fromResource.dependencies = fromResource.dependencies || [];
                    fromResource.dependencies.push(toResource);
                    toResource.dependents = toResource.dependents || [];
                    toResource.dependents.push(fromResource);
                }
            }
        });

        // Calculate depth
        const rootItems = resourceItems.filter(i => !i.valid || !i.dependencies?.length);
        rootItems.forEach((resource) => {
            if (resource.valid) {
                const increaseDepth = (resource: InfraResource, depth: number) => {
                    if (resource.valid && resource.depth < depth) {
                        resource.depth = depth;
                        resource.dependents?.forEach((dependent) => increaseDepth(dependent, depth + 1));
                    }
                };
                resource.dependents?.forEach((dependent) => increaseDepth(dependent, 1));

                const calculateTotalChildren = (resource: InfraResource) => {
                    if (!resource.valid) {
                        return 0;
                    }

                    resource.totalChildren = resource.dependents?.length || 0;
                    resource.dependents?.forEach((dependency) => {
                        resource.totalChildren += calculateTotalChildren(dependency);
                    });
                    return resource.totalChildren;
                }
                calculateTotalChildren(resource);
            }
        });

        console.log('resources', rootItems);
        return rootItems;
    }, [item]);

    const expandedResources = useMemo(() => {
        if (!resources) return undefined;
        const expandedResources: InfraResource[] = [];
        const addResource = (resource?: InfraResource) => {
            if (!resource) return;
            if (!expandedResources.includes(resource)) {
                expandedResources.push(resource);
                if (resource.valid)
                    resource.dependents?.forEach(addResource);
            }
        };
        resources.forEach(addResource);
        return expandedResources;
    }, [resources]);

    const allResourceTypes = useMemo(() => {
        const resourceTypes: string[] = [];
        expandedResources?.forEach((resource) => {
            if (resource.valid && !resourceTypes.includes(resource.resourceType)) {
                resourceTypes.push(resource.resourceType);
            }
        });
        resourceTypes.sort();
        return resourceTypes;
    }, [expandedResources]);

    const initialNodes: Node<InfraResource>[] | undefined = useMemo(() => {
        const spacingY = 140;

        if (!expandedResources)
            return undefined;

        let currentY = 0;
        const nodes: Node<InfraResource>[] = [];
        for (let i = 0; i < expandedResources.length; i++) {
            const resource = expandedResources[i];
            if (!resource?.valid) {
                continue;
            }

            if (visibleResourceTypes?.includes(resource.resourceType)) {
                nodes.push({
                    id: resource.id,
                    data: resource,
                    position: { y: currentY += spacingY, x: 0 },
                    type: 'resource'
                });
            }
        }

        return nodes;
    }, [expandedResources, visibleResourceTypes]);

    const initialEdges: Edge[] | undefined = useMemo(() => expandedResources?.flatMap((resource) => {
        if (resource.valid) {
            return resource.dependencies?.map((dependency) => ({
                id: `${dependency.id}-${resource.id}`,
                source: dependency.id,
                target: resource.id,
                type: 'step'
            })) || [];
        } else {
            return [];
        }
    }), [expandedResources]);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [rect, setRect] = useState<DOMRect | undefined>(undefined);
    const ref = useResizeObserver((_, entry) => {
        setRect(entry.contentRect);
    });

    useEffect(() => {
        if (initialNodes && initialEdges) {
            setNodes(initialNodes);
            setEdges(initialEdges);
            console.log('initialNodes', initialNodes);
        }
    }, [initialEdges, initialNodes, setEdges, setNodes]);

    const nodeTypes = useMemo(() => ({
        resource: ResourceCard,
    }), []);

    return (
        <Stack spacing={1}>
            <Row>
                <SelectItems
                    value={visibleResourceTypes?.at(0)}
                    label="Resource types"
                    placeholder="Select resource types"
                    items={allResourceTypes.map(t => ({ value: t }))}
                    onValueChange={(value) => setVisibleResourceTypes([value])}
                    className="min-w-[220px]" />
            </Row>
            <Card ref={ref} className="w-full">
                <CardOverflow style={{ width: rect?.width, height: '50vh' }}>
                    <Loadable isLoading={isLoading} loadingLabel="Loading graph..." error={error} contentVisible>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            nodeTypes={nodeTypes}
                            proOptions={flowProOptions}
                            minZoom={0.1}
                        >
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </Loadable>
                </CardOverflow>
            </Card>
        </Stack>
    );
}

export default function LayoutResourceGraph() {
    return (
        <ReactFlowProvider>
            <ResourceGraph />
        </ReactFlowProvider>
    )
}

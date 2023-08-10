'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { Tooltip } from '@signalco/ui/dist/Tooltip';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { Card, CardOverflow } from '@signalco/ui/dist/Card';
import { Avatar } from '@signalco/ui/dist/Avatar';
import { useLoadAndError, useResizeObserver } from '@signalco/hooks';
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
                    <Tooltip title={resource.package}>
                        <Avatar>{resource.package.substring(0, 2).toUpperCase()}</Avatar>
                    </Tooltip>
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
    const { item, isLoading, error } = useLoadAndError(fetchInfrastructureCallback);

    const visibleResourceTypes = useMemo(() => {
        return [
            'web:WebApp'
        ]
    }, []);

    const resources: InfraResource[] = useMemo(() => {
        const resourceItems: InfraResource[] = [];
        const graphLines = item?.split('\n');

        // Calculate resources
        graphLines?.forEach((line) => {
            const matchLabel = line.match(/Resource([0-9]*) \[label="(.*)"\];/);
            if (matchLabel) {
                const [, id, urn] = matchLabel;
                const urnMatch = urn.match(/urn:([\w-]*):([\w-]*)::([\w-]*)::([\w-]*):(.*)::([\w-]*)/);
                if (urnMatch) {
                    const [, source, stack, project, packageName, resourceType, name] = urnMatch;
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

    const initialNodes: Node<InfraResource>[] | undefined = useMemo(() => {
        const spacingY = 140;

        if (!expandedResources)
            return undefined;

        let currentY = 0;
        const nodes: Node<InfraResource>[] = [];
        for (let i = 0; i < expandedResources.length; i++) {
            const resource = expandedResources[i];
            if (!resource.valid) {
                continue;
            }

            if (visibleResourceTypes.includes(resource.resourceType)) {
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
    const [ref, rect] = useResizeObserver();

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
    );
}

export default function LayoutResourceGraph() {
    return (
        <ReactFlowProvider>
            <ResourceGraph />
        </ReactFlowProvider>
    )
}

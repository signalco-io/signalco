'use client'

import React, { forwardRef } from 'react'
import { Root, List, Trigger, Content } from '@radix-ui/react-tabs'
import { cx } from '../cx'

const Tabs = Root

const TabsList = forwardRef<
    React.ElementRef<typeof List>,
    React.ComponentPropsWithoutRef<typeof List>
>(({ className, ...props }, ref) => (
    <List
        ref={ref}
        className={cx(
            'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
            className
        )}
        {...props}
    />
))
TabsList.displayName = List.displayName

const TabsTrigger = forwardRef<
    React.ElementRef<typeof Trigger>,
    React.ComponentPropsWithoutRef<typeof Trigger>
>(({ className, ...props }, ref) => (
    <Trigger
        ref={ref}
        className={cx(
            'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
            className
        )}
        {...props}
    />
))
TabsTrigger.displayName = Trigger.displayName

const TabsContent = forwardRef<
    React.ElementRef<typeof Content>,
    React.ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => (
    <Content
        ref={ref}
        className={cx(
            'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className
        )}
        {...props}
    />
))
TabsContent.displayName = Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

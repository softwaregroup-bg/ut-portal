import React from 'react';
import ut from 'ut-run';

declare namespace Portal {
    export type dropdownParams =  string[];
    export interface dropdownResult {
        [name: string]: {
            value: any,
            label: string
        } []
    }

    interface component {
        id?: string,
        title: string,
        component: remotePage,
        [name: string]: any
    }

    export interface pageDescriptor {
        title: string,
        icon?: string,
        permission?: string | string[],
        component: (params?: {
            id?: string,
            type?: string,
            layout?: string
        }) => Promise<React.FC<Record<string, any>>> | React.FC<Record<string, any>>
    }

    export type remotePage = {
        id: string,
        title: string,
        [name: string]: string
        (params: {}): Promise<pageDescriptor>
    }

    interface pages {
        [name: string]: () => pageDescriptor
    }

    export type pageParams = component | remotePage
    export type menuItem = Promise<{
        title?: string;
        icon?: string;
        path: string;
        params: {
            id?: string
        }
    }>
    export type tab = Promise<{
        title?: string;
        icon?: string;
        path: string;
        Component: React.FC;
        params: {
            id?: string
        }
    }>
    export type action = {
        title?: string;
        action: () => {} | void;
    }
    export interface handlers<location = ''> {
        [name: `component$${string}`]: remotePage,
        [name: `component/${string}`]: remotePage,
        handleTabShow?: (tab: remotePage | [remotePage, {id: string}] | {tabs: string, params: any}) => {},
        'portal.dialog.confirm'?: () => Promise<void>
        'portal.customization.get'?: ut.handler<string, unknown, location>,
        'portal.customization.edit'?: ut.handler<{component: {componentId: string}}, unknown, location>,
        'portal.customization.delete'?: ut.handler<{componentId: string[]}, unknown, location>,
        'portal.dropdown.list'?: ut.handler<dropdownParams, dropdownResult, location>,
        portalDropdownList?: ut.handler<dropdownParams, dropdownResult, location>,
        'portal.menu.item'?: (this: ut.port, page: pageParams, $meta: ut.meta) => menuItem,
        portalMenuItem?: (this: ut.port | void, page: pageParams) => menuItem,
        'portal.tab.item'?: (this: ut.port | void, page: pageParams) => tab,
        portalTabItem?: (this: ut.port | void, page: pageParams) => tab,
        'portal.menu.help'?: (this: ut.port | void, options: {}) => action,
        portalMenuHelp?: (this: ut.port | void, options: {}) => action,
    }

    export interface errors {
    }

    interface methods {
        handleDispatchSet?: (dispatch: (action: any) => any) => void
    }

    export type libFactory = ut.libFactory<methods, errors>
    export type handlerFactory = ut.handlerFactory<methods, errors, handlers<'local'>>
    export type handlerSet = ut.handlerSet<methods, errors, handlers<'local'>>
    export type portalFactory = ut.handlers<handlers, {
        'portal.reports.get'?: () => Promise<{

        }>
        'portal.params.get': () => Promise<{
            theme?: {},
            portalName: string,
            portal?: {
                menu: any,
                menuClass?: string,
                tabs: any,
                hideTabs: boolean
            }
        }>
    }>
    export type pageSet<methods, errors> = ut.handlerSet<methods, errors, pages | ut.genericHandlers>
    export type pageFactory<methods, errors> = ut.handlerFactory<methods, errors, pages>
}

declare function Portal(): void;
export = Portal;

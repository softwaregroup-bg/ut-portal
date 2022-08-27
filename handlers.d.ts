declare namespace portalTableTypes {}
declare namespace db$portal_component_delete$ {
  export interface params {
    /**
     * component ids
     */
    componentId?: coreTableTypes.arrayList.params[] | coreTableTypes.arrayList.params;
    /**
     * information for the user that makes the operation
     */
    meta?: coreTableTypes.metaDataTT.params[] | coreTableTypes.metaDataTT.params;
  }
  export type result = any;
}

declare namespace db$portal_component_edit {
  export interface params {
    /**
     * component to edit
     */
    component?: portalTableTypes.componentTT.params[] | portalTableTypes.componentTT.params;
    /**
     * information for the user that makes the operation
     */
    meta?: coreTableTypes.metaDataTT.params[] | coreTableTypes.metaDataTT.params;
  }
  export type result = any;
}

declare namespace db$portal_component_get {
  export interface params {
    componentId?: string | null;
  }
  export type result = any;
}

declare namespace portal_component_delete$ {
  export interface params {
    componentId?: string[];
  }
  export interface result {
    component: {
      componentConfig?: object;
      componentId: string;
    }[];
  }
}

declare namespace portal_component_edit {
  export interface params {
    component?: {
      componentConfig?: object;
      componentId: string;
    };
  }
  export interface result {
    component?: {
      componentConfig?: object;
      componentId: string;
    };
  }
}

declare namespace portal_component_get {
  export interface params {
    componentId: string;
  }
  export interface result {
    component?: {
      componentConfig?: object;
      componentId: string;
    } | null;
  }
}

declare namespace portalTableTypes.componentTT {
  export interface params {
    componentConfig?: string | null;
    componentId?: string | null;
  }
  export type result = unknown;
}

declare namespace portalTableTypes.componentTTU {
  export interface params {
    componentConfig?: string | null;
    componentConfigUpdated?: boolean | null;
    componentId?: string | null;
    componentIdUpdated?: boolean | null;
  }
  export type result = unknown;
}

import ut from 'ut-run';
export interface ports<location = ''> {
  'db/portal.component.delete'?: ut.handler<db$portal_component_delete$.params, db$portal_component_delete$.result, location>,
  db$portalComponentDelete?: ut.handler<db$portal_component_delete$.params, db$portal_component_delete$.result, location>,
  'db/portal.component.edit'?: ut.handler<db$portal_component_edit.params, db$portal_component_edit.result, location>,
  db$portalComponentEdit?: ut.handler<db$portal_component_edit.params, db$portal_component_edit.result, location>,
  'db/portal.component.get'?: ut.handler<db$portal_component_get.params, db$portal_component_get.result, location>,
  db$portalComponentGet?: ut.handler<db$portal_component_get.params, db$portal_component_get.result, location>
}
interface methods extends ports {}

export interface handlers<location = ''> {
  'portal.component.delete'?: ut.handler<portal_component_delete$.params, portal_component_delete$.result, location>,
  portalComponentDelete?: ut.handler<portal_component_delete$.params, portal_component_delete$.result, location>,
  'portal.component.edit'?: ut.handler<portal_component_edit.params, portal_component_edit.result, location>,
  portalComponentEdit?: ut.handler<portal_component_edit.params, portal_component_edit.result, location>,
  'portal.component.get'?: ut.handler<portal_component_get.params, portal_component_get.result, location>,
  portalComponentGet?: ut.handler<portal_component_get.params, portal_component_get.result, location>
}

export interface errors {
  'error.portal': ut.error,
  'error.portal.componentNotFound': ut.errorParam<{ componentId: string | number }>,
  errorPortalComponentNotFound: ut.errorParam<{ componentId: string | number }>
}

import core, {coreTableTypes} from 'ut-core/handlers'
interface methods extends core.handlers {}

export type libFactory = ut.libFactory<methods, errors>
export type handlerFactory = ut.handlerFactory<methods, errors, handlers<'local'>>
export type handlerSet = ut.handlerSet<methods, errors, handlers<'local'>>
export type test = ut.test<methods & handlers>

import portal from 'ut-portal'
export type pageFactory = portal.pageFactory<methods, errors>
export type pageSet = portal.pageSet<methods, errors>

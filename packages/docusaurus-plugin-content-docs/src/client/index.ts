/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useLocation} from '@docusaurus/router';
import {
  useAllPluginInstancesData,
  usePluginData,
} from '@docusaurus/useGlobalData';

import {
  getActivePlugin,
  getLatestVersion,
  getActiveVersion,
  getActiveDocContext,
  getDocVersionSuggestions,
} from './docsClientUtils';
import type {
  GlobalPluginData,
  GlobalVersion,
  ActivePlugin,
  ActiveDocContext,
  DocVersionSuggestions,
} from '@docusaurus/plugin-content-docs/client';
import type {UseDataOptions} from '@docusaurus/types';

// Important to use a constant object to avoid React useEffect executions etc.
// see https://github.com/facebook/docusaurus/issues/5089
const StableEmptyObject = {};

// In blog-only mode, docs hooks are still used by the theme. We need a fail-
// safe fallback when the docs plugin is not in use
export const useAllDocsData = (): {[pluginId: string]: GlobalPluginData} =>
  useAllPluginInstancesData('docusaurus-plugin-content-docs') ??
  StableEmptyObject;

export const useDocsData = (pluginId: string | undefined): GlobalPluginData =>
  usePluginData('docusaurus-plugin-content-docs', pluginId, {
    failfast: true,
  }) as GlobalPluginData;

// TODO this feature should be provided by docusaurus core
export const useActivePlugin = (
  options: UseDataOptions = {},
): ActivePlugin | undefined => {
  const data = useAllDocsData();
  const {pathname} = useLocation();
  return getActivePlugin(data, pathname, options);
};

export const useActivePluginAndVersion = (
  options: UseDataOptions = {},
):
  | undefined
  | {activePlugin: ActivePlugin; activeVersion: GlobalVersion | undefined} => {
  const activePlugin = useActivePlugin(options);
  const {pathname} = useLocation();
  if (activePlugin) {
    const activeVersion = getActiveVersion(activePlugin.pluginData, pathname);
    return {
      activePlugin,
      activeVersion,
    };
  }
  return undefined;
};

// versions are returned ordered (most recent first)
export const useVersions = (pluginId: string | undefined): GlobalVersion[] => {
  const data = useDocsData(pluginId);
  return data.versions;
};

export const useLatestVersion = (
  pluginId: string | undefined,
): GlobalVersion => {
  const data = useDocsData(pluginId);
  return getLatestVersion(data);
};

// Note: return undefined on doc-unrelated pages,
// because there's no version currently considered as active
export const useActiveVersion = (
  pluginId: string | undefined,
): GlobalVersion | undefined => {
  const data = useDocsData(pluginId);
  const {pathname} = useLocation();
  return getActiveVersion(data, pathname);
};

export const useActiveDocContext = (
  pluginId: string | undefined,
): ActiveDocContext => {
  const data = useDocsData(pluginId);
  const {pathname} = useLocation();
  return getActiveDocContext(data, pathname);
};

// Useful to say "hey, you are not on the latest docs version, please switch"
export const useDocVersionSuggestions = (
  pluginId: string | undefined,
): DocVersionSuggestions => {
  const data = useDocsData(pluginId);
  const {pathname} = useLocation();
  return getDocVersionSuggestions(data, pathname);
};

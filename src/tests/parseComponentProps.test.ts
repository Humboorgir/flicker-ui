// @ts-ignore
import { expect, test } from "bun:test";
import parseComponentDependencies from "../lib/handleDependencies/parseDependencies";

test("should detect npm dependencies", () => {
  const code = `
    import { motion } from 'framer-motion';
    import { Button } from '@radix-ui/react-button';
    import { useState } from 'react';
  `;

  const result = parseComponentDependencies(code);
  expect(result.npmDependencies).toEqual(["framer-motion", "@radix-ui/react-button", "react"]);
});

test("should handle scoped packages and subpaths", () => {
  const code = `
    import { AspectRatio } from '@radix-ui/react-aspect-ratio';
    import { domAnimation } from 'framer-motion/dom';
  `;

  const result = parseComponentDependencies(code);
  expect(result.npmDependencies).toEqual(["@radix-ui/react-aspect-ratio", "framer-motion"]);
});

test("should detect hook dependencies", () => {
  const code = `
    import { useAuth } from '@/hooks/useAuth';
    import { useTheme } from '@/hooks/theme/useTheme';
    import { useEffect } from 'react';
  `;

  const result = parseComponentDependencies(code);
  expect(result.hookDependencies).toEqual(["useAuth", "useTheme"]);
});

test("should detect utility dependencies", () => {
  const code = `
    import { cn } from '@/lib/utils';
    import { formatDate } from '@/lib/date-utils';
    import { test } from '@/lib/test';
  `;

  const result = parseComponentDependencies(code);
  expect(result.utilDependencies).toEqual(["utils", "date-utils", "test"]);
});

test("should detect component dependencies", () => {
  const code = `
    import { Button } from '@/components/ui/button';
    import { Dialog } from '@/components/ui/dialog/Dialog';
    import { Card } from '@/components/ui/card';
  `;

  const result = parseComponentDependencies(code);
  expect(result.componentDependencies).toEqual(["button", "Dialog", "card"]);
});

test("should ignore relative imports", () => {
  const code = `
    import { LocalComponent } from './LocalComponent';
    import { helper } from '../lib/helper';
    import { test } from '@/lib/test';
  `;

  const result = parseComponentDependencies(code);
  expect(result).toEqual({
    npmDependencies: [],
    hookDependencies: [],
    utilDependencies: ["test"],
    componentDependencies: [],
  });
});

test("should handle complex example", () => {
  const code = `
    import { motion } from 'framer-motion';
    import { useAuth } from '@/hooks/useAuth';
    import { cn } from '@/lib/utils';
    import { Button } from '@/components/ui/button';
    import { Dialog } from '@radix-ui/react-dialog';
    import { localHelper } from './helpers';
  `;

  const result = parseComponentDependencies(code);
  expect(result).toEqual({
    npmDependencies: ["framer-motion", "@radix-ui/react-dialog"],
    hookDependencies: ["useAuth"],
    utilDependencies: ["utils"],
    componentDependencies: ["button"],
  });
});

test("should deduplicate dependencies", () => {
  const code = `
    import { Button } from '@/components/ui/button';
    import { Button as Btn } from '@/components/ui/button';
    import { cn } from '@/lib/utils';
    import { cn } from '@/lib/utils';
  `;

  const result = parseComponentDependencies(code);
  expect(result.componentDependencies).toEqual(["button"]);
  expect(result.utilDependencies).toEqual(["utils"]);
});

test("should handle different file extensions", () => {
  const code = `
    import { useAuth } from '@/hooks/useAuth.ts';
    import { cn } from '@/lib/utils.js';
    import { Button } from '@/components/ui/button.tsx';
  `;

  const result = parseComponentDependencies(code);
  expect(result.hookDependencies).toEqual(["useAuth"]);
  expect(result.utilDependencies).toEqual(["utils"]);
  expect(result.componentDependencies).toEqual(["button"]);
});

test("should ignore non-component ui imports", () => {
  const code = `
    import { ThemeProvider } from '@/components/providers/theme';
    import { ApiClient } from '@/lib/api-client';
    import { types } from '@/types';
  `;

  const result = parseComponentDependencies(code);
  expect(result).toEqual({
    npmDependencies: [],
    hookDependencies: [],
    utilDependencies: ["api-client"],
    componentDependencies: [],
  });
});

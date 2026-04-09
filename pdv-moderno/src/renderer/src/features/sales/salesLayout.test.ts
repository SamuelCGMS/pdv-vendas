import test from 'node:test';
import assert from 'node:assert/strict';
import { getSalesLayoutProfile } from './salesLayout.ts';

test('mantem estrutura lateral no baseline 1024x768 com densidade compacta', () => {
  const layout = getSalesLayoutProfile({
    width: 1024,
    height: 768,
  });

  assert.equal(layout.workspaceMode, 'split');
  assert.equal(layout.density, 'compact');
  assert.equal(layout.searchActionsMode, 'inline');
  assert.equal(layout.cartDensity, 'compact');
  assert.equal(layout.modalDensity, 'compact');
  assert.equal(layout.summaryWidth, 360);
});

test('mantem resumo lateral e busca inline em 1280x720', () => {
  const layout = getSalesLayoutProfile({
    width: 1280,
    height: 720,
  });

  assert.equal(layout.workspaceMode, 'split');
  assert.equal(layout.density, 'compact');
  assert.equal(layout.searchActionsMode, 'inline');
  assert.equal(layout.cartDensity, 'compact');
  assert.equal(layout.modalDensity, 'compact');
  assert.equal(layout.summaryWidth, 420);
});

test('mantem layout lateral confortavel em 1366x768', () => {
  const layout = getSalesLayoutProfile({
    width: 1366,
    height: 768,
  });

  assert.equal(layout.workspaceMode, 'split');
  assert.equal(layout.density, 'comfortable');
  assert.equal(layout.searchActionsMode, 'inline');
  assert.equal(layout.cartDensity, 'regular');
  assert.equal(layout.modalDensity, 'regular');
  assert.equal(layout.summaryWidth, 480);
});

test('continua confortavel em viewport amplo sem expandir desnecessariamente o resumo', () => {
  const layout = getSalesLayoutProfile({
    width: 1920,
    height: 1080,
  });

  assert.equal(layout.workspaceMode, 'split');
  assert.equal(layout.density, 'comfortable');
  assert.equal(layout.summaryWidth, 480);
});

test('usa a largura interna do workspace no modo empilhado para evitar corte lateral', () => {
  const layout = getSalesLayoutProfile({
    width: 960,
    height: 768,
  });

  assert.equal(layout.workspaceMode, 'stacked');
  assert.equal(layout.searchActionsMode, 'wrapped');
  assert.equal(layout.workspacePadding, 12);
  assert.equal(layout.summaryWidth, 836);
});

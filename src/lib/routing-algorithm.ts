/**
 * Algoritmo de Otimização de Rotas de Picking
 * Utiliza o método "Nearest Neighbor" (Vizinho Mais Próximo)
 * para calcular a rota mais eficiente entre bins
 */

import { Bin, RouteNode } from '@/types';

interface Position {
  x: number;
  y: number;
  z: number;
}

/**
 * Extrai coordenadas de um código de posição
 * Suporta formatos como: "A1-B2-C3" ou "A01" ou posição x,y do objeto
 */
function parsePosition(position: string | { x: number; y: number }): Position {
  if (typeof position === 'object' && 'x' in position && 'y' in position) {
    return {
      x: position.x,
      y: position.y,
      z: 0,
    };
  }
  
  const parts = position.split('-');
  return {
    x: parts[0]?.charCodeAt(0) || 0,
    y: parseInt(parts[1] || '0'),
    z: parseInt(parts[2] || '0'),
  };
}

/**
 * Calcula distância euclidiana 3D entre duas posições
 */
function calculateDistance(pos1: Position, pos2: Position): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const dz = pos2.z - pos1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Algoritmo Nearest Neighbor para otimizar rota de picking
 */
export function optimizePickingRoute(bins: Bin[]): RouteNode[] {
  if (bins.length === 0) return [];
  if (bins.length === 1) {
    const position = bins[0].position || { x: 0, y: 0 };
    const positionStr = typeof position === 'string' ? position : `${position.x},${position.y}`;
    return [
      {
        binId: bins[0].id,
        binCode: bins[0].code,
        position: positionStr,
        sequence: 1,
        distance: 0,
        estimatedTime: 0,
      },
    ];
  }

  const unvisited = [...bins];
  const route: RouteNode[] = [];
  let currentBin = unvisited[0]; // Começa do primeiro bin
  let sequence = 1;
  let totalDistance = 0;

  // Remove o primeiro bin da lista de não visitados
  unvisited.shift();
  
  // Adiciona o primeiro nó
  const firstPosition = currentBin.position || { x: 0, y: 0 };
  const firstPositionStr = typeof firstPosition === 'string' ? firstPosition : `${firstPosition.x},${firstPosition.y}`;
  
  route.push({
    binId: currentBin.id,
    binCode: currentBin.code,
    position: firstPositionStr,
    sequence,
    distance: 0,
    estimatedTime: 0,
  });

  // Algoritmo Nearest Neighbor
  while (unvisited.length > 0) {
    const currentPos = parsePosition(currentBin.position || { x: 0, y: 0 });
    let nearestBin = unvisited[0];
    let nearestDistance = Infinity;
    let nearestIndex = 0;

    // Encontra o bin mais próximo
    unvisited.forEach((bin, index) => {
      const binPos = parsePosition(bin.position || { x: 0, y: 0 });
      const distance = calculateDistance(currentPos, binPos);
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestBin = bin;
        nearestIndex = index;
      }
    });

    // Remove o bin mais próximo da lista de não visitados
    unvisited.splice(nearestIndex, 1);
    
    // Atualiza distância total
    totalDistance += nearestDistance;
    
    // Calcula tempo estimado (assumindo 30 segundos por unidade de distância)
    const estimatedTime = Math.round(nearestDistance * 30);
    
    // Adiciona à rota
    sequence++;
    const nearestPosition = nearestBin.position || { x: 0, y: 0 };
    const nearestPositionStr = typeof nearestPosition === 'string' ? nearestPosition : `${nearestPosition.x},${nearestPosition.y}`;
    
    route.push({
      binId: nearestBin.id,
      binCode: nearestBin.code,
      position: nearestPositionStr,
      sequence,
      distance: nearestDistance,
      estimatedTime,
    });

    currentBin = nearestBin;
  }

  return route;
}

/**
 * Calcula métricas da rota otimizada
 */
export function calculateRouteMetrics(route: RouteNode[]) {
  const totalDistance = route.reduce((sum, node) => sum + node.distance, 0);
  const totalTime = route.reduce((sum, node) => sum + node.estimatedTime, 0);
  const totalStops = route.length;

  return {
    totalDistance: Math.round(totalDistance * 10) / 10,
    totalTime,
    totalStops,
    efficiency: totalStops > 0 ? Math.round((totalDistance / totalStops) * 100) / 100 : 0,
  };
}

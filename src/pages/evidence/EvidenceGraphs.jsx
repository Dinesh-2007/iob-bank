import { useEffect, useId, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { RISK_COLORS } from './evidenceUtils';

export const AnomalyDot = ({ cx, cy, payload }) => {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;
  const isAnomaly = payload?.isAnomaly;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isAnomaly ? 4.5 : 2.8}
      fill={isAnomaly ? '#cb4540' : '#2f6fa3'}
      stroke="#ffffff"
      strokeWidth={isAnomaly ? 1.8 : 1.1}
    />
  );
};

export const ForceDirectedGraph = ({ nodes, links, height = 340, arrows = false }) => {
  const svgRef = useRef(null);
  const graphMarkerSeed = useId();
  const markerId = useMemo(
    () => `graph-arrow-${graphMarkerSeed.replace(/[^a-zA-Z0-9_-]/g, '')}`,
    [graphMarkerSeed]
  );

  useEffect(() => {
    if (!svgRef.current || !nodes.length || !links.length) return undefined;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth || 920;
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const nodeData = nodes.map((node) => ({ ...node }));
    const linkData = links.map((link) => ({ ...link }));
    const [minAmount, maxAmount] = d3.extent(linkData, (link) => link.amount);
    const safeMin = typeof minAmount === 'number' ? minAmount : 1;
    const safeMax = typeof maxAmount === 'number' && maxAmount > safeMin ? maxAmount : safeMin + 1;
    const linkWidthScale = d3.scaleLinear().domain([safeMin, safeMax]).range([1.2, 5.4]);

    if (arrows) {
      svg
        .append('defs')
        .append('marker')
        .attr('id', markerId)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 18)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#6c8193');
    }

    const linkSelection = svg
      .append('g')
      .selectAll('line')
      .data(linkData)
      .join('line')
      .attr('stroke-width', (link) => linkWidthScale(link.amount))
      .attr('stroke', (link) => (link.suspicious ? '#cc5e4e' : '#89a1b6'))
      .attr('stroke-opacity', 0.72)
      .attr('marker-end', arrows ? `url(#${markerId})` : null);

    const nodeSelection = svg
      .append('g')
      .selectAll('circle')
      .data(nodeData)
      .join('circle')
      .attr('r', (node) => {
        if (node.kind === 'device') return 9 + Math.min(5, node.centrality || 1);
        return 7 + Math.min(8, Math.round((node.centrality || 1) * 1.2));
      })
      .attr('fill', (node) => {
        if (node.kind === 'device') return '#2b6499';
        if (node.kind === 'external') return '#8192a3';
        return RISK_COLORS[node.riskBand] || '#2f6fa3';
      })
      .attr('stroke', '#f6f9fc')
      .attr('stroke-width', 1.4);

    nodeSelection.append('title').text((node) => `${node.label} | ${node.riskBand || 'Medium'} risk`);

    const labelSelection = svg
      .append('g')
      .selectAll('text')
      .data(nodeData)
      .join('text')
      .text((node) => node.shortLabel || node.label)
      .attr('font-size', 10)
      .attr('font-weight', 600)
      .attr('fill', '#1f3448')
      .attr('text-anchor', 'middle')
      .attr('dy', 22);

    const simulation = d3
      .forceSimulation(nodeData)
      .force(
        'link',
        d3
          .forceLink(linkData)
          .id((node) => node.id)
          .distance((link) => (link.suspicious ? 86 : 122))
      )
      .force('charge', d3.forceManyBody().strength(-430))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((node) => (node.kind === 'device' ? 18 : 15 + Math.min(8, node.centrality || 1))));

    const drag = d3
      .drag()
      .on('start', (event, node) => {
        if (!event.active) simulation.alphaTarget(0.25).restart();
        node.fx = node.x;
        node.fy = node.y;
      })
      .on('drag', (event, node) => {
        node.fx = event.x;
        node.fy = event.y;
      })
      .on('end', (event, node) => {
        if (!event.active) simulation.alphaTarget(0);
        node.fx = null;
        node.fy = null;
      });

    nodeSelection.call(drag);

    simulation.on('tick', () => {
      linkSelection
        .attr('x1', (link) => link.source.x)
        .attr('y1', (link) => link.source.y)
        .attr('x2', (link) => link.target.x)
        .attr('y2', (link) => link.target.y);

      nodeSelection.attr('cx', (node) => node.x).attr('cy', (node) => node.y);
      labelSelection.attr('x', (node) => node.x).attr('y', (node) => node.y);
    });

    return () => simulation.stop();
  }, [arrows, height, links, markerId, nodes]);

  return <svg ref={svgRef} className="evidence-svg" role="img" aria-label="Relationship graph" />;
};

export const DirectedFlowGraph = ({ nodes, links, height = 330 }) => {
  const svgRef = useRef(null);
  const flowMarkerSeed = useId();
  const markerId = useMemo(
    () => `flow-arrow-${flowMarkerSeed.replace(/[^a-zA-Z0-9_-]/g, '')}`,
    [flowMarkerSeed]
  );

  useEffect(() => {
    if (!svgRef.current || !nodes.length || !links.length) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth || 920;
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    svg
      .append('defs')
      .append('marker')
      .attr('id', markerId)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 14)
      .attr('refY', 0)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#60798f');

    const layerKeys = [...new Set(nodes.map((node) => node.layer))].sort((left, right) => left - right);
    const xScale = d3.scalePoint().domain(layerKeys).range([86, width - 90]);
    const nodePosition = new Map();

    layerKeys.forEach((layer) => {
      const layerNodes = nodes.filter((node) => node.layer === layer);
      const yScale = d3.scalePoint().domain(layerNodes.map((node) => node.id)).range([44, height - 42]);
      layerNodes.forEach((node) => {
        nodePosition.set(node.id, { x: xScale(layer), y: yScale(node.id) });
      });
    });

    const [minAmount, maxAmount] = d3.extent(links, (link) => link.amount);
    const safeMin = typeof minAmount === 'number' ? minAmount : 1;
    const safeMax = typeof maxAmount === 'number' && maxAmount > safeMin ? maxAmount : safeMin + 1;
    const strokeScale = d3.scaleLinear().domain([safeMin, safeMax]).range([1.4, 10]);

    const buildPath = (link) => {
      const start = nodePosition.get(link.source);
      const end = nodePosition.get(link.target);
      if (!start || !end) return '';
      const curve = 80;
      return `M${start.x},${start.y} C${start.x + curve},${start.y} ${end.x - curve},${end.y} ${end.x},${end.y}`;
    };

    svg
      .append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', (link) => buildPath(link))
      .attr('fill', 'none')
      .attr('stroke', '#6885a0')
      .attr('stroke-opacity', 0.78)
      .attr('stroke-width', (link) => strokeScale(link.amount))
      .attr('marker-end', `url(#${markerId})`);

    const nodeGroup = svg.append('g').selectAll('g').data(nodes).join('g');

    nodeGroup
      .append('circle')
      .attr('cx', (node) => nodePosition.get(node.id)?.x || 0)
      .attr('cy', (node) => nodePosition.get(node.id)?.y || 0)
      .attr('r', 11)
      .attr('fill', (node) => RISK_COLORS[node.riskBand] || '#2f6fa3')
      .attr('stroke', '#f6f9fc')
      .attr('stroke-width', 1.2);

    nodeGroup
      .append('text')
      .attr('x', (node) => nodePosition.get(node.id)?.x || 0)
      .attr('y', (node) => (nodePosition.get(node.id)?.y || 0) + 23)
      .text((node) => node.label)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('font-weight', 600)
      .attr('fill', '#273d54');
  }, [height, links, markerId, nodes]);

  return <svg ref={svgRef} className="evidence-svg" role="img" aria-label="Directed flow graph" />;
};

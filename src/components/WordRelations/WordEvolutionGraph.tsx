import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Cognate } from '../../types';

interface WordEvolutionGraphProps {
  cognates: Cognate[];
}

export function WordEvolutionGraph({ cognates }: WordEvolutionGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create hierarchical data
    const root = {
      name: "كتاب",
      children: cognates.map(c => ({
        name: c.word,
        originalScript: c.originalScript,
        language: c.language
      }))
    };

    const treeLayout = d3.tree()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    const hierarchy = d3.hierarchy(root);
    const treeData = treeLayout(hierarchy);

    // Add links
    svg.selectAll(".link")
      .data(treeData.links())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#4B5563")
      .attr("stroke-width", 1.5)
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

    // Add nodes
    const nodes = svg.selectAll(".node")
      .data(treeData.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    nodes.append("circle")
      .attr("r", 6)
      .attr("fill", d => d.depth === 0 ? "#10B981" : "#3B82F6");

    // Add labels
    nodes.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -8 : 8)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.originalScript || d.data.name)
      .clone(true).lower()
      .attr("stroke", "white")
      .attr("stroke-width", 3);

    // Add language labels
    nodes.append("text")
      .attr("dy", "1.5em")
      .attr("x", d => d.children ? -8 : 8)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .attr("class", "text-xs text-gray-500")
      .text(d => d.data.language || "Arabic");

  }, [cognates]);

  return (
    <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Word Evolution Tree</h4>
      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          className="w-full"
          style={{ minWidth: '800px', height: '400px' }}
        />
      </div>
    </div>
  );
}
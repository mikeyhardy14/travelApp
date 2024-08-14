'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { FeatureCollection, Feature, GeoJsonProperties, Geometry } from 'geojson';

const ExplorePage: React.FC = () => {
  const mapRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const width = 960;
    const height = 500;

    const svgElement = mapRef.current;
    if (!svgElement) return;

    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height);

    const projection = geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);

    const path = geoPath().projection(projection);

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        svg.selectAll('path').attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    d3.json<FeatureCollection<Geometry, GeoJsonProperties>>(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
    ).then((worldData) => {
      if (!worldData) return;

      svg.selectAll('path')
        .data(worldData.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#69b3a2')
        .attr('stroke', '#ffffff')
        .on('mouseover', function (event, d) {
          d3.select(this).attr('fill', '#f00');
          const tooltip = d3.select(tooltipRef.current);
          tooltip.style('left', `${event.pageX + 10}px`);
          tooltip.style('top', `${event.pageY - 28}px`);
          tooltip.style('opacity', 1);
          tooltip.text(d.properties?.name ?? 'Unknown'); // Display country name or 'Unknown'
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', '#69b3a2');
          d3.select(tooltipRef.current).style('opacity', 0);
        });
    }).catch((error) => {
      console.error('Error loading or processing world data:', error);
    });
  }, []);

  return (
    <div className="relative p-8 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Explore the World</h1>
      <svg ref={mapRef}></svg>
      <div ref={tooltipRef} className="absolute bg-gray-700 text-white px-2 py-1 rounded opacity-0 pointer-events-none items-center"></div>
    </div>
  );
};

export default ExplorePage;

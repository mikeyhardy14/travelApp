'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { geoMercator, geoPath } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { FeatureCollection, Feature, Geometry, GeoJsonProperties, Point } from 'geojson';

interface City {
  name: string;
  lat: number;
  lon: number;
}

const ExplorePage: React.FC = () => {
  const mapRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const width = 960;
    const height = 500;

    const svgElement = mapRef.current;
    if (!svgElement) return;

    const svg = d3.select(svgElement)
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#87CEEB')
      .style('border', '10px solid #000')
      .style('border-radius', '15px');

    const projection = geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);

    const path = geoPath().projection(projection);

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        svg.selectAll('path').attr('transform', event.transform);
        svg.selectAll('circle').attr('transform', event.transform);
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
          tooltip.text(d.properties?.name ?? 'Unknown');
        })
        .on('mouseout', function () {
          d3.select(this).attr('fill', '#69b3a2');
          d3.select(tooltipRef.current).style('opacity', 0);
        })
        .on('click', function (event, d) {
          const [[x0, y0], [x1, y1]] = path.bounds(d);
          event.stopPropagation();

          svg.transition().duration(750).call(
            zoomBehavior.transform,
            d3.zoomIdentity
              .translate(width / 2, height / 2)
              .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
              .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
          );

          // Load city data for the selected country
          loadCityData(d.properties?.name);
        });

      // Clicking outside the countries zooms out
      svg.on('click', () => {
        svg.transition().duration(750).call(
          zoomBehavior.transform,
          d3.zoomIdentity.scale(1).translate(0, 0)
        );
      });
    }).catch((error) => {
      console.error('Error loading or processing world data:', error);
    });
  }, []);

  const loadCityData = (countryName: string | undefined) => {
    if (!countryName) return;

    // This is just a mock; in a real application, you'd fetch actual city data.
    const cityData: City[] = [
      { name: 'City1', lat: 48.8566, lon: 2.3522 }, // Example city
      { name: 'City2', lat: 51.5074, lon: -0.1278 }, // Example city
    ];

    setCities(cityData);

    const svg = d3.select(mapRef.current);
    const projection = geoMercator().scale(150).translate([960 / 2, 500 / 1.5]);

    svg.selectAll('circle').remove(); // Remove previous circles

    svg.selectAll('circle')
      .data(cityData)
      .enter()
      .append('circle')
      .attr('cx', d => projection([d.lon, d.lat])![0])
      .attr('cy', d => projection([d.lon, d.lat])![1])
      .attr('r', 5)
      .attr('fill', 'red')
      .on('mouseover', function (event, d) {
        const tooltip = d3.select(tooltipRef.current);
        tooltip.style('left', `${event.pageX + 10}px`);
        tooltip.style('top', `${event.pageY - 28}px`);
        tooltip.style('opacity', 1);
        tooltip.text(d.name);
      })
      .on('mouseout', function () {
        d3.select(tooltipRef.current).style('opacity', 0);
      });
  };

  return (
    <div className="relative p-8 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Explore the World</h1>
      <svg ref={mapRef}></svg>
      <div ref={tooltipRef} className="absolute bg-gray-700 text-white px-2 py-1 rounded opacity-0 pointer-events-none"></div>
    </div>
  );
};

export default ExplorePage;

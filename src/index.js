import { SpaceX } from "./api/spacex";
import * as d3 from "d3";
import * as Geo from './geo.json';

let mapSvg;
let mapProjection;

document.addEventListener("DOMContentLoaded", setup);

function setup() {
    const spaceX = new SpaceX()

    spaceX.launches().then(data => {
        const listContainer = document.getElementById("listContainer");
        renderLaunches(data.results, listContainer);
        spaceX.pads().then(uniquePads => drawMap(uniquePads));
    }).catch(error => {
        console.error("Ошибка:", error);
    })

}

function renderLaunches(launches, container) {
    const list = document.createElement("ul");
    if (!launches) return;

    launches.forEach(launch => {
        const item = document.createElement("li");
        item.innerHTML = launch.name;
        item.style.cursor = "pointer";


        item.addEventListener("mouseenter", () => {
            const pad = launch.pad;
            if (!pad || !pad.longitude || !pad.latitude) return;

            const [x, y] = mapProjection([pad.longitude, pad.latitude]);

            const highlightLayer = mapSvg.select("#highlight-layer");

            highlightLayer.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 8)
                .style("fill", "red")
                .style("stroke", "black")
                .style("stroke-width", 2);

            highlightLayer.append("text")
                .attr("x", x + 12)
                .attr("y", y + 4)
                .text(pad.name)
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .style("fill", "black")
                .style("stroke", "white")
                .style("stroke-width", 0.5);
        });

        item.addEventListener("mouseleave", () => {
            mapSvg.select("#highlight-layer").selectAll("*").remove();
        });

        list.appendChild(item);
    });

    container.replaceChildren(list);
}
function drawMap(padsData) {
    const width = 640;
    const height = 480;
    const margin = { top: 20, right: 10, bottom: 40, left: 100 };

    d3.select('#map').selectAll("*").remove();

    mapSvg = d3.select('#map').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    mapProjection = d3.geoMercator()
        .scale(100)
        .center([0, 20])
        .translate([width / 2, height / 2]);

    const colorScale = d3.scaleOrdinal()
        .domain([0, 1])
        .range(["#4e79a7", "#f28e2b"]);

    mapSvg.append("g")
        .selectAll("path")
        .data(Geo.features)
        .enter()
        .append("path")
        .attr("class", "topo")
        .attr("d", d3.geoPath().projection(mapProjection))
        .attr("fill", function (d) { return colorScale(0); })
        .style("opacity", 0.7);

    if (padsData) {
        mapSvg.append("g")
            .selectAll("circle")
            .data(padsData)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                if (!d || !d.longitude || !d.latitude) return -1000;
                return mapProjection([d.longitude, d.latitude])[0];
            })
            .attr("cy", function(d) {
                if (!d || !d.longitude || !d.latitude) return -1000;
                return mapProjection([d.longitude, d.latitude])[1];
            })
            .attr("r", 4)
            .style("fill", "red")
            .style("stroke", "white")
            .style("stroke-width", 1)
            .style("opacity", 0.8);
    }
    mapSvg.append("g").attr("id", "highlight-layer");
}
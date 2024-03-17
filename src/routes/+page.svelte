<div class="chart" bind:this={chartdiv}></div>
<p>{ country }</p>
<button><a href="/{ country }">Go!</a></button>


<style>
  .chart {
      width: 100%;
      height: 500px;
  }
</style>


<script>
  import { onMount } from "svelte";
  import * as am5 from "@amcharts/amcharts5?client";
  import * as am5map from "@amcharts/amcharts5/map?client";
  import worldLow from "@amcharts/amcharts5-geodata/worldLow?client";
  import am5themes_Animated from "@amcharts/amcharts5/themes/Animated?client";

  export let country = "None";

  let chartdiv;

  onMount(() => {
      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      let root = am5.Root.new(chartdiv);


      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);


      // Create the map chart
      // https://www.amcharts.com/docs/v5/charts/map-chart/
      let chart = root.container.children.push(am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20
      }));



      // Create main polygon series for countries
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
      let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: worldLow 
      }));

      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        toggleKey: "active",
        interactive: true
      });

      polygonSeries.mapPolygons.template.states.create("hover", {
        fill: root.interfaceColors.get("primaryButtonHover")
      });

      polygonSeries.mapPolygons.template.states.create("active", {
        fill: root.interfaceColors.get("primaryButtonHover")
      });


      // Create series for background fill
      // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
      let backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
      backgroundSeries.mapPolygons.template.setAll({
        fill: root.interfaceColors.get("alternativeBackground"),
        fillOpacity: 0.1,
        strokeOpacity: 0
      });
      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
      });

      let graticuleSeries = chart.series.unshift(
        am5map.GraticuleSeries.new(root, {
          step: 10
        })
      );

      graticuleSeries.mapLines.template.set("strokeOpacity", 0.1)

      // Set up events
      let previousPolygon;

      polygonSeries.mapPolygons.template.on("active", function(active, target) {
        if (previousPolygon && previousPolygon != target) {
          previousPolygon.set("active", false);
        }
        if (target.get("active")) {
          selectCountry(target.dataItem.get("id"));
          country = target.dataItem.dataContext.name;
        }
        previousPolygon = target;
      });

      function selectCountry(id) {
        let dataItem = polygonSeries.getDataItemById(id);
        let target = dataItem.get("mapPolygon");
        if (target) {
          let centroid = target.geoCentroid();
          if (centroid) {
            chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
            chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
          }
        }
      }
  });
</script>
<script>
  // @ts-nocheck

  // import npm modules
  import * as topojson from "topojson-client";
  import * as d3 from "d3";
  import * as _ from "lodash";
  import { pymChild } from "./pymDefine";

  // import static assets
  import shapefile from "./assets/tile-data.json";

  // import svelte sub-components
  import TileTooltip from "./TileTooltip.svelte";
  import TileAbbrText from "./TileAbbrText.svelte";

  // export arguments for component
  export let rawData;
  export let selectedState;
  export let highlightedFeature;

  const margin = { right: 5, left: 5 };

  //create groupedData variable that has a count for each state
  $: groupedData = rawData.reduce((count, obj) => {
    count.set(obj.State, count.has(obj.State) ? count.get(obj.State) + 1 : 1);
    return count;
  }, new Map());

  // initial map width value, bound to element width
  $: screenWidth = 760;

  // create a maximum screenWidth value to avoid an svg width larger than 760
  $: width =
    screenWidth > 760
      ? 760 - margin.left - margin.right
      : screenWidth - margin.left - margin.right;

  // holds tooltip info
  let tooltipVal;

  // define na color
  let naColor = "#DDDDDD";

  // let clickToggle = false;

  // reactively convert raw topojson to geojson
  $: shapefileInit = shapefile
    ? topojson.feature(shapefile, shapefile.objects["tile-data"])
    : null;

  // reactively grab the features array from the geojson
  $: shapefileFeatures = shapefileInit ? shapefileInit.features : [];

  // create the d3 identity for projection
  $: projection = d3
    .geoIdentity()
    .fitSize([width, width * 0.75], shapefileInit);

  // reactively create a d3 path function based on the projection
  $: path = d3.geoPath().projection(projection);

  // lookup data from dataMap based on feature
  const lookupData = (feature, groupedData) => {
    return groupedData.get(feature.properties.name);
  };

  // lookup feature based on data (state name)
  const reverseLookupData = (value, shapefileFeatures) => {
    return shapefileFeatures.filter((e) => e.properties.name === value)[0];
  };

  // show tooltip for a given feature
  const showTooltip = (feature) => {
    if (lookupData(feature, groupedData)) {
      // create value for tooltip
      tooltipVal = `<b>${feature.properties.name}</b><br>${lookupData(
        feature,
        groupedData
      )} program${lookupData(feature, groupedData) > 1 ? "s" : ""}`;
    }
  };

  // show/clear highlight functions
  const showHighlight = (feature) => {
    // check if feature has data
    if (lookupData(feature, groupedData)) {
      highlightedFeature = feature;
    }
  };

  const clearHighlight = () => {
    highlightedFeature = null;
  };

  // set the selectedState reactive variable (and clear function)
  const setSelectedState = (feature) => {
    if (lookupData(feature, groupedData)) {
      // check if feature has data
      selectedState = feature.properties.name;
      pymChild.scrollParentToChildEl("mapFooterContainer");

      // scrollIntoView is no longer needed because of pym
      // scrollIntoView(document.querySelector(".secondary-container"), {
      //   block: "start",
      //   inline: "nearest",
      //   behavior: "smooth",
      // });
    }
  };

  const clearSelectedState = () => {
    selectedState = "All";
    clearHighlight();
  };

  $: {
    if (selectedState !== "All" && selectedState !== "National") {
      highlightedFeature = reverseLookupData(selectedState, shapefileFeatures);
      showTooltip(highlightedFeature);
    }
  }
</script>

<!-- main container -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container" bind:clientWidth={screenWidth}>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <svg
    width={screenWidth > 760 ? 760 : screenWidth}
    height={width * 0.75}
    viewBox="0 0 {width} {width * 0.75}"
    role="img"
    aria-label="Tile map of the United States showing which states have apprenticeship programs."
    on:click={(e) => {
      e.target.tagName === "svg" ? clearSelectedState() : null;
    }}
  >
    <!-- each feature of the shapefile... -->
    {#each shapefileFeatures as feature}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- if the feature is not highlighted, add <path> here-->
      {#if feature.properties.name !== highlightedFeature?.properties.name}
        {#if lookupData(feature, groupedData) > 0}
          <!-- if there's data, show a focusable group -->
          <!-- feature group -->
          <g
            tabindex="-1"
            focusable="false"
            role="button"
            style="cursor: pointer;"
            on:mouseover={() => {
              showHighlight(feature);
              showTooltip(feature);
            }}
            on:mouseout={() => clearHighlight()}
            on:focus={() => {
              showHighlight(feature);
              showTooltip(feature);
            }}
            on:blur={() => clearHighlight()}
            on:mouseup={() => setSelectedState(feature)}
            on:touchend={() => setSelectedState(feature)}
          >
            <!-- feature path (square) -->
            <path d={path(feature)} fill="#1796D2" />
            <!-- feature text (abbreviation) -->
            <TileAbbrText {path} {feature} {width} />
          </g>
        {:else}
          <!-- if there's no data, show a grey tile -->
          <g focusable="false" role="presentation">
            <!-- feature path (square) -->
            <path d={path(feature)} fill={naColor} />
            <!-- feature text (abbreviation) -->
            <TileAbbrText {path} {feature} {width} />
          </g>
        {/if}
      {/if}
    {/each}
    <!-- if the feature IS highlighted, add <path> on top instead -->
    {#if highlightedFeature}
      <!-- feature group -->
      <!-- svelte-ignore missing-declaration -->
      <g
        style="cursor: pointer;"
        tabindex="-1"
        focusable="false"
        role="button"
        on:mouseout={() => clearHighlight()}
        on:blur={() => clearHighlight()}
        on:touchend={() => {
          setSelectedState(highlightedFeature);
          gtag(
            "event",
            "button_click", //eventName
            {
              "firing-module-name": "apprenticeship-tile-map", //firingModuleName
              "target-classes": null,
              "target-id": null,
              "target-text": selectedState,
              "tile-select": selectedState,
            }
          );
        }}
        on:mouseup={() => {
          setSelectedState(highlightedFeature);
          gtag(
            "event",
            "button_click", //eventName
            {
              "firing-module-name": "apprenticeship-tile-map", //firingModuleName
              "target-classes": null,
              "target-id": null,
              "target-text": selectedState,
              "tile-select": selectedState,
            }
          );
        }}
      >
        <!-- feature path (square) -->
        <path d={path(highlightedFeature)} fill="black" />
        <!-- feature text (abbreviation) -->
        <TileAbbrText
          {path}
          {width}
          feature={highlightedFeature}
          isHighlighted={lookupData(highlightedFeature, groupedData)}
        />
      </g>
    {/if}
  </svg>

  <!-- if there's a highlightedFeature, tooltip value, and non NA value from the lookup, display the tooltip  -->
  {#if highlightedFeature && tooltipVal && lookupData(highlightedFeature, groupedData)}
    <TileTooltip {path} {highlightedFeature} {tooltipVal} {width} {margin} />
  {/if}
</div>

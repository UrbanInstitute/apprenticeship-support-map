<script>
  export let width; //width of the chart
  export let path; //path of the feature
  export let feature; //relevant feature
  export let isHighlighted = false; //highlight bool
</script>

<!-- text element, differentiated based on isHighlighted -->
<text
  class="tile-abbr-text"
  x={path.centroid(feature)[0]}
  y={path.centroid(feature)[1]}
  text-anchor="middle"
  dominant-baseline="middle"
  font-size={width > 400 ? "18px" : "14px"}
  fill={isHighlighted ? "var(--color-white)" : "var(--color-black)"}
  stroke="white"
  stroke-opacity={isHighlighted ? 0.66 : 0.33}
  stroke-width={isHighlighted ? "1px" : "2px"}
  >{feature.properties.abbr}
</text>

<style>
  .tile-abbr-text {
    pointer-events: none;
    cursor: default;
    paint-order: stroke;
  }
</style>

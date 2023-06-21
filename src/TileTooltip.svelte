<script>
  export let path;
  export let highlightedFeature;
  export let tooltipVal;
  export let width;
  export let margin;

  // init positions
  $: xPositionInit = path.centroid(highlightedFeature)[0];
  $: yPosition = path.centroid(highlightedFeature)[1];

  // tooltip width to determine if it's cut off
  $: tooltipWidth = 100;
  $: tooltipHeight = 100;

  // first test case of the tooltip extending beyond the right side of the map
  $: xPosition =
    tooltipWidth / 2 + xPositionInit + 10 > width
      ? width - tooltipWidth / 2
      : xPositionInit;

  // second test case of the tooltip extending beyond the left side of the map
  $: {
    xPosition =
      xPositionInit + 10 - tooltipWidth / 2 < 0 ? tooltipWidth / 2 : xPosition;
  }

  // tooltip arrow init value
  $: arrowOffset = `${tooltipWidth / 2 - 10}px`;

  $: {
    // if the tooltip extends beyond the right side, set the arrow appropriately
    if (tooltipWidth / 2 + xPositionInit > width) {
      arrowOffset = `${tooltipWidth - (width - xPositionInit + 10)}px`;
      // if the tooltip extends beyond the left side, set the arrow appropriately
    } else if (xPositionInit - tooltipWidth / 2 < 0) {
      arrowOffset = `${xPositionInit - 10}px`;
      // else it's in bounds, set it in the middle
    }
  }
</script>

<!-- tooltip container -->
<!-- use the bounds of the tile to calulcate how far away the tooltip should be from the tile -->
<div
  bind:clientWidth={tooltipWidth}
  bind:clientHeight={tooltipHeight}
  class="tooltip-container"
  style={`top: ${
    yPosition -
    tooltipHeight -
    11 -
    (path.bounds(highlightedFeature)[1][1] -
      path.bounds(highlightedFeature)[0][1]) /
      2
  }px; left: ${
    xPosition + margin.left / 2 + margin.right / 2
  }px; transform: translate(-${tooltipWidth / 2}px,0px`}
>
  <!-- tooltip div -->
  <div class="tooltip-main">
    {@html tooltipVal}
  </div>
  <!-- arrow div -->
  <div class="tooltip-arrow" style={`--x-offset:${arrowOffset}`}>
    <div class="inner-arrow" />
  </div>
</div>

<style>
  .tooltip-container {
    position: absolute;
    max-width: 200px;
    background-color: var(--color-white);
    padding: 10.5px;
    border: 1px var(--color-gray) solid;
    z-index: 2;
    white-space: nowrap;
  }
  /* lightgrey large arrow (creates border on top of small) */
  .tooltip-arrow {
    border-left: solid transparent 10px;
    border-right: solid transparent 10px;
    border-top: solid var(--color-gray) 10px;
    bottom: -10px;
    content: " ";
    height: 0;
    left: var(--x-offset); /*set above based on whether tooltip is in bounds*/
    position: absolute;
    width: 0;
  }
  /* white small arrow */
  .inner-arrow {
    border-left: solid transparent 10px;
    border-right: solid transparent 10px;
    border-top: solid var(--color-white) 10px;
    margin-left: -10px;
    margin-top: -11px;
    position: relative;
  }
</style>

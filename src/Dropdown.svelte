<script>
  import { createEventDispatcher } from "svelte";

  // define arguments
  export let value;
  export let dataCols;
  export let dataColsLabels;
  export let inlineLabel;
  export let dropdownWidth = 260;
  export let highlightedFeature;

  // create dispatcher
  const dispatch = createEventDispatcher();

  // define the svg arrow
  let arrow = `data:image/svg+xml;utf8,<svg width='16' height='10' viewBox='0 0 16 10' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M15.1313 0.666626C15.5179 0.666626 15.7794 0.846014 15.9272 1.20479C16.0749 1.56356 15.9954 1.85507 15.7111 2.09052L8.65117 9.12027C8.45791 9.26602 8.2419 9.33329 8.00316 9.33329C7.76442 9.33329 7.57115 9.26602 7.42335 9.12027L0.283802 2.09052C-0.000415318 1.85507 -0.0686276 1.55235 0.0677969 1.20479C0.21559 0.846014 0.477071 0.666626 0.863607 0.666626H15.1313Z' fill='%231696D2'/></svg>`;

  // set the highlightedFeature to null if the value is All or National
  $: {
    if (value === "All" || value === "National") {
      highlightedFeature = null;
    }
  }
</script>

<div class="dropdown-container-inner">
  <label aria-hidden="true" hidden for="opts">{inlineLabel}</label>
  <select
    bind:value
    name="opts"
    id="opts"
    style={`--bg-img: url("${arrow}"); width: ${dropdownWidth}px;`}
    aria-label={inlineLabel}
    on:change={(e) => {
      dispatch("change", e);
    }}
  >
    <!-- options -->
    {#each dataCols as col, i (col)}
      {#if col !== ""}
        <option value={col}>{dataColsLabels[i]}</option>
      {/if}
    {/each}
  </select>
</div>

<style>
  #opts {
    color: var(--color-gray-shade-darker);
    padding: var(--spacing-2) var(--spacing-3);
    font-size: var(--font-size-normal);
    font-family: Lato, helvetica, sans-serif;
    font-style: normal;
    border: 1px solid var(--color-gray-shade-medium);
    cursor: pointer;
    background-color: var(--color-white);
    background-image: var(--bg-img);
    background-size: var(--spacing-4) var(--spacing-4);
    background-repeat: no-repeat;
    background-position: 95% center;
    z-index: 2;
    position: relative;
    overflow: hidden;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .dropdown-container-inner {
    display: flex;
    align-items: center;
  }
</style>

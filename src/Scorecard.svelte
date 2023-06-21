<script>
  import * as d3 from "d3";
  export let scorecardDataObj;
  export let accessor = "apprentices";
  // export let article = null;
  export let label = accessor;
</script>

<div class="scorecard-container">
  <!-- scorecard number -->
  {#if scorecardDataObj}
    <div class="scorecard-number">
      <div class="scorecard-number-inner">
        <!-- format the number -->
        {d3.format(",")(scorecardDataObj[accessor])}
      </div>
    </div>
  {/if}
  <!-- scorecard label -->
  {#if label}
    <div class="scorecard-text-group font-light">
      <div class="scorecard-text">
        {label}
      </div>
    </div>
  {/if}
</div>

<style>
  .scorecard-container {
    display: flex;
    flex-direction: row;
    gap: 2px;
    align-content: center;
    justify-content: center;
    max-height: 75px;
    height: 75px;
  }

  .scorecard-number {
    display: flex;
    align-items: center;
    font-size: 36px;
    font-weight: 700;
    height: 75px;
    color: var(--color-white);
    background-color: var(--color-blue-shade-darker);
    padding: 0 1rem;
    text-decoration: underline;
    text-underline-offset: 8px;
    text-decoration-color: var(--color-blue);
    text-decoration-thickness: 5px;
  }
  .scorecard-number-inner {
    transform: translateY(-6px);
  }

  .scorecard-text-group {
    display: flex;
    align-items: center;
    height: 75px;
    background-color: var(--color-gray-shade-light);
  }

  .scorecard-text {
    font-size: var(--font-size-3xl);
    overflow: nowrap;
    padding: 0 1rem;
    text-transform: uppercase;
  }

  /* on smaller screens, reduce font size so there's no vertical stacking */
  @media screen and (max-width: 450px) {
    .scorecard-text {
      font-size: var(--font-size-2xl);
    }
  }

  @media screen and (max-width: 376px) {
    .scorecard-number {
      height: var(--spacing-16);
    }
    .scorecard-container {
      height: var(--spacing-16);
      max-height: var(--spacing-16);
    }
    .scorecard-text-group {
      height: var(--spacing-16);
    }
  }
</style>

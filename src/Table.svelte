<script>
  export let tableData;
</script>

<div class="table-container-inner">
  <table>
    <!-- header -->
    <thead>
      <tr>
        <th>Program name</th>
        <th>Location</th>
        <th>Description</th>
      </tr>
    </thead>
    <!-- body -->
    <tbody>
      {#if tableData.length > 0}
        {#each tableData as row}
          <tr>
            <td
              ><div class="td-content">
                <!-- if there's a link, add one to Program name -->
                {#if row["Link"]}
                  <a href={row["Link"]} target="_blank">{row["Program Name"]}</a
                  >
                {:else}
                  {row["Program Name"]}
                {/if}
              </div></td
            >
            <!-- if National, add it, else show the City+Abbrevation -->
            <td
              ><div class="td-content">
                {row.City === "National"
                  ? "National"
                  : `${row.City}, ${row["State Abbreviation"]}`}
              </div></td
            >
            <!-- description -->
            <td><div class="td-content">{row["Description"]}</div></td>
          </tr>
        {/each}
      {:else}
        <!-- if no data, show a row of empty data -->
        <tr class="no-data"
          ><td><div class="td-content">&nbsp</div></td>
          <td><div class="td-content">&nbsp</div></td>
          <td><div class="td-content">&nbsp</div></td></tr
        >
      {/if}
    </tbody>
  </table>
</div>

<style>
  /* overflow appears outside */
  .table-container-inner {
    overflow-x: auto;
  }

  /* padding for content */
  th,
  td {
    padding-left: var(--spacing-4);
    padding-right: 0px;
    text-align: left;
  }

  /* padding-right on last cell */
  th:last-child,
  td:last-child {
    padding-right: var(--spacing-4);
  }

  /* <a> tag color */
  td a {
    color: var(--color-black);
  }

  /* min width for content wells */
  td .td-content {
    min-width: 146px;
  }

  /* no data styles */
  tr.no-data td {
    border: 0;
  }

  tr.no-data td:last-child {
    width: 100%;
  }
</style>

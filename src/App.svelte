<script>
  // @ts-nocheck

  // import our own components/assets
  import TileMap from "./TileMap.svelte";
  import Table from "./Table.svelte";
  import Dropdown from "./Dropdown.svelte";
  import Scorecard from "./Scorecard.svelte";
  import UrbanLogo from "./assets/urban-logo.svg";

  // import other npm modules
  import * as d3 from "d3";
  import { onMount } from "svelte";

  // declare main reactive variables
  $: selectedState = "All";
  $: selectedType = "All";

  // holds raw data from csv
  $: scorecardData = [];
  $: scorecardDataObj = {
    type: "All",
    apprentices: 0,
    occupations: 0,
    partners: 0,
  };

  // declare main arrays
  let rawDataInit = [];
  let rawData = [];
  let tableData = [];
  let rawStateList = [];

  // define main vars/dropdown labels
  let stateList = ["All", "National"];
  let stateListLabels = ["All states", "National programs"];
  let typeList = ["All", "Youth", "Tech"];
  let typeListLabels = [
    "All apprenticeships",
    "Youth apprenticeships",
    "Tech apprenticeships",
  ];

  // define highlighted feature
  $: highlightedFeature = null;

  // if the selectedState is All or National, set highlightedFeature to null
  $: {
    if (selectedState === "All" || selectedState === "National") {
      highlightedFeature = null;
    }
  }

  // setup the scorecard values
  $: {
    // filter the scorecard data based on the selectedType
    scorecardDataObj = scorecardData.filter((d) => d.type === selectedType)[0];
  }

  //setup the tabular data
  $: {
    // grab data from init data
    rawDataInit.sort((a, b) => {
      return a["Program Name"].localeCompare(b["Program Name"]);
    });

    rawData = rawDataInit;

    // if the type has a non-All value, filter
    if (selectedType !== "All") {
      rawData = rawData.filter((d) => d[selectedType] === "Yes");
    }

    // now that rawData is filtered to the type, use that to filter tableData based on state
    tableData = rawData;
    if (selectedState === "National") {
      tableData = rawData.filter((d) => d.National === "Yes");
    } else if (selectedState !== "All") {
      tableData = rawData.filter((d) => d.State === selectedState);
    }
  }

  // lifecycle method onMount: run when component is added to the DOM
  onMount(async () => {
    // load csv data
    rawDataInit = await d3.csv("table-data.csv");
    scorecardData = await d3.csv("scorecard-data.csv");

    // sort alphabetically by State (for dropdowns)
    rawDataInit.sort((a, b) => {
      return a["State"].localeCompare(b["State"]);
    });

    // update arrays for dropdowns
    rawStateList = [
      ...new Set(rawDataInit.map((d) => (d["State"] === "" ? "" : d["State"]))),
    ];
    stateList = [...stateList, ...rawStateList];
    stateListLabels = [...stateListLabels, ...rawStateList];
  });
</script>

<main>
  <div class="main-container">
    <div class="main-inner-container">
      <!-- scorecard group -->
      <div class="scorecard-group-container">
        <Scorecard {scorecardDataObj} accessor="apprentices" article="in" />
        <Scorecard {scorecardDataObj} accessor="occupations" article="at" />
        <Scorecard
          {scorecardDataObj}
          accessor="partners"
          label="employer partners"
        />
      </div>
      <!-- divider -->
      <hr style="border-top:1px solid #D2D2D2; margin: 0;" />
      <!-- chart title -->
      <h4 class="chart-title">
        Explore Urban-Supported Apprenticeships Nationwide
      </h4>
      <!-- subtitle -->
      <div class="map-dropdown">
        <!-- dropdown -->
        <Dropdown
          bind:value={selectedType}
          dataCols={typeList}
          dataColsLabels={typeListLabels}
          inlineLabel="Select a project"
          on:change={(e) =>
            gtag(
              "event",
              "button_click", //eventName
              {
                "firing-module-name": "apprenticeship-tile-map", //firingModuleName
                "target-classes": e.detail.target.className,
                "target-id": e.detail.target.id,
                "target-text": e.detail.target.ariaLabel,
                "dropdown-select": e.detail.target.value,
              }
            )}
        />
      </div>
      <TileMap {rawData} bind:selectedState bind:highlightedFeature />

      <!-- footer container logo -->
      <div class="map-footer-container" id="mapFooterContainer">
        <span class="logo-container">
          <UrbanLogo
            alt="Urban Institute Logo"
            aria-hidden="true"
            width="200px"
          />
        </span>
      </div>
    </div>
  </div>

  <div class="secondary-container" id="secondary">
    <!-- dropdowns above table -->
    <div class="dropdown-container">
      <!-- svelte-ignore missing-declaration -->
      <Dropdown
        bind:value={selectedState}
        dataCols={stateList}
        dataColsLabels={stateListLabels}
        inlineLabel="Select a region"
        bind:highlightedFeature
        on:change={(e) => {
          gtag(
            "event",
            "button_click", //eventName
            {
              "firing-module-name": "apprenticeship-table", //firingModuleName
              "target-classes": e.detail.target.className,
              "target-id": e.detail.target.id,
              "target-text": e.detail.target.ariaLabel,
              "dropdown-select": e.detail.target.value,
            }
          );
        }}
      />
      <Dropdown
        bind:value={selectedType}
        dataCols={typeList}
        dataColsLabels={typeListLabels}
        inlineLabel="Select a project"
        on:change={(e) => {
          gtag(
            "event",
            "button_click", //eventName
            {
              "firing-module-name": "apprenticeship-table", //firingModuleName
              "target-classes": e.detail.target.className,
              "target-id": e.detail.target.id,
              "target-text": e.detail.target.ariaLabel,
              "dropdown-select": e.detail.target.value,
            }
          );
        }}
      />
    </div>
    <div class="table-parent-container">
      <!-- table -->
      <div class="table-container">
        <Table {tableData} />
      </div>
    </div>
  </div>
  <!-- about text -->
  <!-- <h2 style="text-transform: uppercase; font-weight: 300;">About</h2>
  <p>
    These projects have been funded, either wholly or in part, with federal
    funds from the Department of Labor, Employment and Training Administration.
    The contents of this dashboard do not necessarily reflect the views or
    policies of the Department of Labor, nor does mention of trade names,
    commercial products, or organizations imply endorsement of the same by the
    US government.
  </p>
  <p>
    Shruti Nayak, Andrew Campbell, Bhavani Arabandi, and Erikah Garnett
    contributed to the data collection for this dashboard.
  </p> -->
</main>

<style>
  /* main container */
  .main-container {
    max-width: 760px;
    margin: auto;
    justify-content: center;
  }

  /* scorecard group */
  .scorecard-group-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 14px;
    margin-bottom: var(--spacing-16);
  }

  h4.chart-title {
    margin-top: var(--spacing-12);
  }

  /* map dropdown styling */
  .map-dropdown {
    display: flex;
    justify-content: space-between;
    margin: 1.5em 0;
  }

  /* styling of urban logo  */
  .map-footer-container {
    display: flex;
    justify-content: end;
  }

  .logo-container {
    display: flex;
    align-items: center;
    margin-right: 5px;
  }

  /* bottom section (table/dropdowns) */
  .secondary-container {
    max-width: 1170px;
    margin: auto;
    margin-top: var(--spacing-16);
    justify-content: center;
  }

  #secondary {
    scroll-margin-top: 70px;
  }

  /* dropdowns for table */
  .dropdown-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin: 0 var(--spacing-4) var(--spacing-12) var(--spacing-4);
  }

  /* table */
  .table-parent-container {
    justify-self: center;
    align-content: center;
    display: flex;
    overflow-x: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .table-parent-container::-webkit-scrollbar {
    display: none;
  }

  .table-container {
    margin-bottom: 80px;
    margin-left: var(--spacing-4); /* when there's scroll, margin? */
    margin-right: var(--spacing-4); /* when there's scroll, margin? */
  }

  @media screen and (max-width: 768px) {
    .table-container {
      margin-bottom: var(--spacing-16);
    }

    .main-inner-container {
      margin-left: var(--spacing-4);
      margin-right: var(--spacing-4);
    }
  }

  @media screen and (max-width: 540px) {
    .dropdown-container {
      justify-content: center;
      margin: 0 0 var(--spacing-12) 0;
    }
  }

  @media screen and (max-width: 376px) {
    .scorecard-group-container {
      margin-bottom: var(--spacing-12);
    }
    h4.chart-title {
      margin-top: var(--spacing-8);
    }

    .table-container {
      margin-bottom: var(--spacing-12);
    }

    .logo-container {
      width: 100px;
    }
  }
</style>

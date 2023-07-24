import React, { useState, useContext, useEffect } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import SideForm from "./components/nav/Form.js";
import PurchasesReview from "./pageTemplates/PurchasesReview/PurchasesReview";
import InflationDeflation from "./pageTemplates/InflationDeflation/InflationDeflation";
import ToTopButton from "./components/ToTopButton.js";
import NavbarMain from "./components/NavbarMain";
import Footer from "./components/Footer.js";
import { ExtensionContext } from "@looker/extension-sdk-react";
import moment from "moment";
import Template1 from "./pageTemplates/Template1/Template1";
import TopNav from './components/nav/TopNav.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import {
  LOOKER_MODEL,
  LOOKER_EXPLORE,
  LOOKML_FIELD_TAGS,
  PRODUCT_MOVEMENT_VIS_DASHBOARD_ID,
} from "./utils/constants";

import { sortDateFilterList } from "./utils/globalFunctions";

export const Main = () => {
  const { core40SDK: sdk } = useContext(ExtensionContext);

  const [currentNavTab, setCurrentNavTab] = useState("dashboard");

  //Create states for global variables
  const [isFetchingLookmlFields, setIsFetchingLookmlFields] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState();

  const [productMovementFields, setProductMovementFields] = useState([]);
  const [filterOptions, setFilterOptions] = useState([]);
  const [dateFilterOptions, setDateFilterOptions] = useState([]);
  const [quickFilter, setQuickFilter] = useState([]);

  const [dateRange, setDateRange] = useState("");
  const [showMenu, setShowMenu] = useState();

  const slideIt = (show) =>{
     setShowMenu(show)
   }

  // Initialize the states
  useEffect(() => {
    function groupFieldsByTags(fields) {
      const fieldsByTag = {};
      fields.forEach((field) => {
        field.tags.forEach((tag) => {
          if (fieldsByTag[tag] === undefined) {
            fieldsByTag[tag] = [field];
          } else {
            fieldsByTag[tag].push(field);
          }
        });
      });
      return fieldsByTag;
    }

    const fetchLookmlFields = async () => {
      const {
        fields: { dimensions, filters, measures },
      } = await sdk.ok(
        sdk.lookml_model_explore(LOOKER_MODEL, LOOKER_EXPLORE, "fields")
      );

      const lookmlFields = [...dimensions, ...filters, ...measures];
      const fieldsByTag = groupFieldsByTags(lookmlFields);

      const _filterOptions = fieldsByTag[LOOKML_FIELD_TAGS.filter];
      const _dateFilterOptions = fieldsByTag[LOOKML_FIELD_TAGS.date_filter];

      const _productMovementfieldOptions = fieldsByTag[LOOKML_FIELD_TAGS.productMovementField];
      const _quickFilterOptions = fieldsByTag[LOOKML_FIELD_TAGS.quick_filter];



      console.log("fieldsByTag", fieldsByTag)

        console.log("this is field", LOOKML_FIELD_TAGS.productMovementField)
          console.log("this is quick", LOOKML_FIELD_TAGS.quick_filter)

          console.log(_quickFilterOptions)

      const _dateRange = fieldsByTag[LOOKML_FIELD_TAGS.dateRange];

      const defaultFilterSelections = Object.fromEntries(
        _filterOptions.map((filter) => [filter.name, "N/A"])
      );

      const defaultDateFilterSelections = _dateFilterOptions?.find((filter) => {
        if (filter["suggestions"]) {
          return filter["suggestions"].find((s) => {
            return s.toUpperCase() === "YES";
          });
        }
      });

      if (defaultDateFilterSelections != undefined) {
        setSelectedDateFilter(defaultDateFilterSelections["name"]);
      }

      setSelectedDateRange(getDefaultDateRange());

      setFilterOptions(_filterOptions);
      setProductMovementFields(_productMovementfieldOptions);
      setDateFilterOptions(sortDateFilterList(_dateFilterOptions));

      setQuickFilter(_quickFilterOptions);

      setSelectedFilters(defaultFilterSelections);
      setDateRange(_dateRange[0]);
      setIsFetchingLookmlFields(false);
    };

    try {
      fetchLookmlFields();
    } catch (e) {
      console.error("Error fetching Looker filters and fields", e);
    }
  }, []);

  useEffect(() => {}, [selectedDateRange]);

  const getDefaultDateRange = () => {
    let prevMonth = moment().subtract(1, "month");
    let startOfMonth = prevMonth
      .startOf("month")
      .format("YYYY-MM-DD")
      .toString();
    let endOfMonth = prevMonth.endOf("month").format("YYYY-MM-DD").toString();
    return `${startOfMonth} to ${endOfMonth}`;
  };

  return (
    <>
      <NavbarMain />

      <Container fluid className="mt-50 padding-0">
      <TopNav/>
        <div className={showMenu ? "largePadding" : "slideOver largePadding"}>
          <div id="nav2">
            <Tabs
              defaultActiveKey={currentNavTab}
              onSelect={(k) => setCurrentNavTab(k)}
              className="mb-0"
              fill
            >
              <Tab eventKey="dashboard" title="Purchases Review">
                <PurchasesReview
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}

                />
              </Tab>
              <Tab eventKey="product-movement" title="Product Movement Report">
                <Template1
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  quickFilterOptions={quickFilter}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  dashboardId={PRODUCT_MOVEMENT_VIS_DASHBOARD_ID}
                  tabKey={"product-movement"}
                  currentNavTab={currentNavTab}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                />
              </Tab>
              <Tab eventKey="invoice" title="Invoice Report">
                <Template1
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  dashboardId={PRODUCT_MOVEMENT_VIS_DASHBOARD_ID}
                  tabKey={"invoice"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                />
              </Tab>
              <Tab eventKey="auto-sub" title="Auto-Sub Report">
                <Template1
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  dashboardId={PRODUCT_MOVEMENT_VIS_DASHBOARD_ID}
                  tabKey={"auto-sub"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                />
              </Tab>
              <Tab eventKey="id" title="Inflation/Deflation Report">
                <InflationDeflation
                  currentNavTab={currentNavTab}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  filterOptions={filterOptions}
                  dateFilterOptions={dateFilterOptions}
                  fieldOptions={productMovementFields}
                  isFetchingLookmlFields={isFetchingLookmlFields}
                  setSelectedDateFilter={setSelectedDateFilter}
                  selectedDateFilter={selectedDateFilter}
                  setSelectedDateRange={setSelectedDateRange}
                  selectedDateRange={selectedDateRange}
                  dateRange={dateRange}
                  upperDashboardId={PRODUCT_MOVEMENT_VIS_DASHBOARD_ID}
                  lowerDashboardId={PRODUCT_MOVEMENT_VIS_DASHBOARD_ID}
                  tabKey={"id"}
                  showMenu={showMenu}
                  setShowMenu={setShowMenu}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </Container>
      <ToTopButton />

      <SideForm />
      <Footer />
    </>
  );
};

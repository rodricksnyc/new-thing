import React, { useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";

export const DateFilterGroup = ({
  dateFilterOptions,
  setSelectedDateFilter,
  selectedDateFilter,
}) => {
  const handleSelection = (e) => {
    setSelectedDateFilter(e.target.id);
  };

  useEffect(() => {
    //
  }, [selectedDateFilter]);

  return (
    <Row>
      <Col xs={12} md={7}></Col>
      <Col xs={12} md={5}>
        <div className="grid2 mneg40">
          {dateFilterOptions?.map((filter) => {
            return (
              <div className="one radio" key={filter.name}>
                <Form.Group key={filter["description"]}>
                  <Form.Check
                    checked={
                      selectedDateFilter === filter["name"] ? true : false
                    }
                    id={filter["name"]}
                    type="radio"
                    name="filters"
                    onChange={handleSelection}
                    label={filter["label_short"].replace("(Yes / No)", "")}
                  />
                </Form.Group>
              </div>
            );
          })}
        </div>
      </Col>
    </Row>
  );
};

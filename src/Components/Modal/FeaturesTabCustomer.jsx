import { Col, Card, ListGroup, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./CustomerModalCss.css";

const FeaturesTab = ({ featuresData, setFeaturesData }) => {
  const { t } = useTranslation();

  const handleCheckboxChange = (key, checked) => {
    const updatedFeaturesData = {
      ...featuresData,
      [key]: { ...featuresData[key], checked },
    };
    setFeaturesData(updatedFeaturesData);
  };

  const handleInputChange = (key, value) => {
    const updatedFeaturesData = {
      ...featuresData,
      [key]: { ...featuresData[key], text: value },
    };
    setFeaturesData(updatedFeaturesData);
  };

  const handleKeyPress = (e) => {
    if (e.key < "0" || e.key > "9") {
      e.preventDefault();
    }
  };

  return (
    <div className="tab-pane mb-2 mt-3" id="Featuresedit">
      <Col md={12} className="customer col-md-12">
        <div className="body customer-demo-card">
          <div
            className="customer row clearfix"
            style={{ marginBottom: "25px" }}
          >
            {Object.keys(featuresData).map((key) => (
              <Col key={key} lg={12} md={12} className="custom-col-lg-12">
                <Card className="custom-card">
                  <ListGroup className="listgroup">
                    <ListGroup.Item className="listgroupitem modal-new-add">
                      <div className="custome-float-left modal-head">
                        {t(key.replace(/_/g, " "))}
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={featuresData[key].checked}
                            onChange={(e) =>
                              handleCheckboxChange(key, e.target.checked)
                            }
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <div className="custome-float-right">
                        <Form.Control
                          disabled={featuresData[key].disabled}
                          type="text"
                          className="custome-form-control modal-select search-bg"
                          value={
                            featuresData[key].text == 0
                              ? ""
                              : featuresData[key].text
                          }
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            ))}
          </div>
        </div>
      </Col>
    </div>
  );
};

export default FeaturesTab;

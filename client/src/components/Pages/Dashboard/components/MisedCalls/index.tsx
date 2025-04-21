import { Col, Row } from "react-bootstrap";

import { NoticeBoard } from "./NoticeBoard";
import { MissedCallCard } from "./MissedCallGraph";

export const MissedCalls = () => {
  return (
    <Row className="clearfix mt-3">
      <Col lg={8} className="p-0">
        <div className="multilinechart">
          <MissedCallCard
          />
        </div>
      </Col>

      <Col lg={4} className="p-0 noticeboardchart">
        <NoticeBoard />
      </Col>
    </Row>
  );
};

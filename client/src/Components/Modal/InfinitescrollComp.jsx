import React from "react";
import { Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
const Infinitescroll = ({
  loading,
  hasMore,
  fetchMoreData,
  userTotal,
  dynamicHeightForTabs,
  children,
}) => {
  return (
    <InfiniteScroll
      dataLength={userTotal}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        loading && (
          <div
            style={{ height: dynamicHeightForTabs }}
            className="d-flex justify-content-center align-items-center"
          >
            <Spinner
              animation="border"
              role="status"
              style={{ color: "var(--main-orange-color)" }}
            />
          </div>
        )
      }
      scrollableTarget="scrollableDiv"
    >
      {children}
    </InfiniteScroll>
  );
};

export default Infinitescroll;

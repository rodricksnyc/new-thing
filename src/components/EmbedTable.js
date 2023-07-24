import React, { useCallback, useContext } from "react";
import { LookerEmbedSDK } from "@looker/embed-sdk";
import { ExtensionContext } from "@looker/extension-sdk-react";
import styled from "styled-components";
import { Spinner } from "react-bootstrap";

const EmbedTable = ({ queryId }) => {
  const { extensionSDK } = useContext(ExtensionContext);

  const embedCtrRef = useCallback(
    (el) => {
      const hostUrl = extensionSDK.lookerHostData.hostUrl;

      if (el && hostUrl && queryId) {
        el.innerHTML = "";
        LookerEmbedSDK.init(hostUrl);
        LookerEmbedSDK.createExploreWithUrl(
          `${hostUrl}/embed/query/rebecca_thompson_project/order_items?qid=${queryId}&sdk=2&embed_domain=${hostUrl}&sandboxed_host=true`
        )
          .appendTo(el)
          .build()
          .connect()

          .catch((error) => {
            console.error("Connection error", error);
          });
      }
    },
    [queryId]
  );

  return <>{queryId ? <Explore ref={embedCtrRef} /> : <Spinner />}</>;
};

const Explore = styled.div`
  width: 100%;
  min-height: unset;
  & > iframe {
    width: 100%;
    height: 100%;
  }
`;

export default EmbedTable;

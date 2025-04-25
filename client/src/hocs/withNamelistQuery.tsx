import React from "react";
import { ComponentType } from "react";
import { IKeys, useNameListQuery } from "../requests/queries";

export const withNameList = <T extends Record<string, any>>(
  WrappedComponent: ComponentType<T>,
  lists: { [key in IKeys]?: boolean | undefined }
) => {

  return (props: Omit<T, `${keyof (typeof lists)}s`>) => {
    const { data: extensions } = useNameListQuery({
      key: "extension",
      enabled: !!lists.extension,
    });

    const { data: ivrs } = useNameListQuery({
      key: "ivr",
      enabled: !!lists.ivr,
    });

    const { data: ringGroups } = useNameListQuery({
      key: "ringGroup",
      enabled: !!lists.ringGroup,
    });

    const { data: conferences } = useNameListQuery({
      key: "conference",
      enabled: !!lists.conference,
    });

    const { data: recordings } = useNameListQuery({
      key: "recording",
      enabled: !!lists.recording,
    });

    const { data: dialplans } = useNameListQuery({
      key: "dialplan",
      enabled: !!lists.dialplan,
    });

    if (
      (!!lists.extension && extensions === undefined) ||
      (!!lists.ivr && ivrs === undefined) ||
      (!!lists.ringGroup && ringGroups === undefined) ||
      (!!lists.conference && conferences === undefined) ||
      (!!lists.recording && recordings === undefined) ||
      (!!lists.dialplan && dialplans === undefined)
    ) {
      return null;
    }

    return (
      <WrappedComponent
        {...(props as T)}
        recordings={recordings}
        conferences={conferences}
        ringGroups={ringGroups}
        ivrs={ivrs}
        extensions={extensions}
        dialplans={dialplans}
      />
    );
  };
};

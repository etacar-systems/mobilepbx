import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export interface IQueryParamResult<T extends Array<string> | undefined> {
  value?: T extends Array<string> ? T[number] : string;
  set: (
    param?: T extends Array<string> ? T[number] : string | number | boolean
  ) => void;
}

interface IQueryParam<T extends Array<string> = Array<string>> {
  key: string;
  allowedValues?: T;
}

export interface IQueryParamsMethods {
  stringifyArray: (data: Array<string>) => string | undefined;
  parseArray: (data: string) => Array<string>;
}

export const useQueryParams = <
  T extends Array<IQueryParam> = Array<IQueryParam>
>(
  queryKeys: T,
  defaultValues?: { [key in T[number]["key"]]?: string | number | boolean }
): {
  [key in T[number]["key"]]: IQueryParamResult<
  Extract<T[number], { key: key }>['allowedValues']
  >;
} & IQueryParamsMethods => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();

  useEffect(() => {
    if (!defaultValues) return;
    Object.keys(defaultValues).forEach((key: T[number]["key"]) => {
      const value = queryParams.get(key) || undefined;
      if (defaultValues[key] && !value) {
        queryParams.set(key, defaultValues[key].toString());
      }
    });
    navigate({ search: queryParams.toString() });
  }, []);

  const defaultQueryParams = useMemo<{
    [key in T[number]["key"]]: IQueryParamResult<
      Extract<T[number], { key: key }>["allowedValues"]
    >;
  }>(() => {
    return queryKeys.reduce((acc, { key }) => {
      const value = queryParams.get(key) || undefined;
      const a: IQueryParamResult<Array<string>> = {
        value,
        set(
          param?: Parameters<
            IQueryParamResult<Array<string>>["set"]
          >[0]
        ) {
          if (
            param === undefined ||
            (typeof param === "string" && param.length === 0)
          ) {
            queryParams.delete(key);
          } else {
            const newValue = param.toString();
            queryParams.set(key, newValue);
          }
          navigate({ search: queryParams.toString() });
        },
      };
      acc[key] = a;
      return acc;
    }, {} as any);
  }, [navigate, queryKeys, queryParams]);

  const parseArray = useCallback((data: string) => {
    return data.split(",").reduce<Array<string>>((acc, value) => {
      if (value.length !== 0) acc.push(value);
      return acc;
    }, []);
  }, []);

  const stringifyArray = useCallback((data: Array<string>) => {
    const result = data
      .reduce<Array<string>>((acc, value) => {
        if (value.length !== 0) acc.push(value);
        return acc;
      }, [])
      .join(",");
    return result.length === 0 ? undefined : result;
  }, []);

  return {
    ...defaultQueryParams,
    stringifyArray,
    parseArray,
  };
};

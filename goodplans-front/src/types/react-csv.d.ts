declare module "react-csv" {
  import * as React from "react";

  export interface CSVLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    data: any[] | object;
    headers?: any[];
    filename?: string;
    separator?: string;
    enclosingCharacter?: string;
    uFEFF?: boolean;
    target?: string;
  }

  export class CSVLink extends React.Component<CSVLinkProps> {}
}

import { describe, expect, it } from "vitest";

import * as fs from "fs";
import path from "path";

import { ThriftData, TerminalNode } from "@/index";

function getFullPath(file_name: string): string {
  return path.resolve(__dirname, "test_data", file_name).toString();
}

describe("Thrift Parser", () => {
  it("load files", () => {
    const files = fs.readdirSync(getFullPath(""));

    for (const file of files) {
      const content = fs.readFileSync(getFullPath(file)).toString();
      // expect(content).matchSnapshot();
      const data = ThriftData.fromString(content);
      expect(data.document.toStringTree()).matchSnapshot();
    }
  });

  it("load thrift from string", function () {
    const data = ThriftData.fromString('include "shared.thrift"');
    expect(data.tokenStream.get(0).text).toStrictEqual("include");
    const header = data.document.getChild(0);
    const include = header.getChild(0);
    const token = include.getChild(0);

    expect(token.text).toStrictEqual("include");
    expect(token instanceof TerminalNode).ok;
    expect(token.childCount).toStrictEqual(0);
  });

  it("load literal value", function () {
    const thrift = `const string default_user = 'it\\'s name is \\" x \\" or \\'x\\' \\r\\t\\n';`;
    const data = ThriftData.fromString(thrift);
    expect(data.tokenStream.get(0).text).toStrictEqual("const");

    const defines = data.document.getChild(0);
    const constValue = defines.getChild(0);
    const token = constValue.getChild(0);

    expect(token.text).toStrictEqual("const");
    expect(token instanceof TerminalNode).ok;
    expect(token.childCount).toStrictEqual(0);
    expect(data.tokenStream.get(8).text).toStrictEqual(
      `'it\\'s name is \\" x \\" or \\'x\\' \\r\\t\\n'`,
    );
  });

  it("load literal value2", function () {
    const thrift = `const string default_user = "\\'default_user\\'" ;
      const string default_name = '"abc\\'s"';`;

    const data = ThriftData.fromString(thrift);
    expect(data instanceof ThriftData).ok;
    expect(data.tokenStream.get(0).text).toMatchInlineSnapshot('"const"');
  });

  it("test complex literal more", () => {
    const thrift = `const string default_user = "\\'default_user\\'" ;
      const string default_name = '"abc\\'s"';`;
    const data = ThriftData.fromString(thrift);
    expect(data instanceof ThriftData).ok;
    expect(data.tokenStream.get(0).text).toMatchInlineSnapshot('"const"');
  });
});

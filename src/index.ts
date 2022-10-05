import {
  CharStreams,
  CharStream,
  CommonTokenStream,
  ParserRuleContext,
} from "antlr4ts";
import { BailErrorStrategy } from "antlr4ts";
import { ThriftParser, DocumentContext } from "./antlr_gen/ThriftParser";
import { ThriftLexer } from "./antlr_gen/ThriftLexer";

export type ParserResult = [
  ThriftLexer,
  CommonTokenStream,
  ThriftParser,
  DocumentContext,
];

export function parse(inputStream: CharStream): ParserResult {
  const lexer = new ThriftLexer(inputStream);
  const tokens = new CommonTokenStream(lexer);
  const parser = new ThriftParser(tokens);
  parser.errorHandler = new BailErrorStrategy();

  const ctx = new ParserRuleContext();
  parser.enterRule(ctx, 0, 0);
  const document = parser.document();
  return [lexer, tokens, parser, document];
}

export class ThriftData {
  lexer: ThriftLexer;
  tokens: CommonTokenStream;
  parser: ThriftParser;
  document: DocumentContext;

  constructor(inputStream: CharStream) {
    const [lexer, tokens, parser, document] = parse(inputStream);

    this.lexer = lexer;
    this.tokens = tokens;
    this.parser = parser;
    this.document = document;
  }

  static fromString(data: string): ThriftData {
    const inputStream = CharStreams.fromString(data);
    return new ThriftData(inputStream);
  }
}

export * from "./antlr_gen/ThriftLexer";
export * from "./antlr_gen/ThriftListener";
export * from "./antlr_gen/ThriftParser";
export * from "./antlr_gen/ThriftVisitor";
export * from "antlr4ts";
export * from "antlr4ts/tree";

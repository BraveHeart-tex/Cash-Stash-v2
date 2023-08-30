import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  util,
  ZodParsedType,
  ZodIssueCode,
  ErrorMapCtx,
  ZodIssueOptionalMessage,
} from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MONTHS_OF_THE_YEAR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const errorMap = (issue: ZodIssueOptionalMessage, _ctx: ErrorMapCtx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Zorunlu saha";
      } else {
        message = `Beklenen : ${issue.expected}, Girilen : ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Geçersiz değer, beklenen ${JSON.stringify(
        issue.expected,
        util.jsonStringifyReplacer
      )}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(
        issue.keys,
        ", "
      )}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Geçersiz giriş`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(
        issue.options
      )}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(
        issue.options
      )}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Geçersiz tarih`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;

          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${
          issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`
        } ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        issue.minimum === 1
          ? (message = "Boş geçilemez")
          : (message = `Uzunluğu ${
              issue.exact ? "tam olarak" : issue.inclusive ? `en az` : `minimum`
            } ${issue.minimum} olmalıdır`);
      else if (issue.type === "number")
        message = `Değer ${
          issue.exact
            ? `${issue.minimum} olmalıdır.`
            : issue.inclusive
            ? ` >= ${issue.minimum} olmalıdır `
            : ` > ${issue.minimum} olmalıdır`
        }`;
      else if (issue.type === "date")
        message = `Tarih ${
          issue.exact ? ` = ` : issue.inclusive ? ` >= ` : ` > `
        }${new Date(Number(issue.minimum))}`;
      else message = "Geçersiz giriş";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${
          issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`
        } ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `${
          issue.exact ? `tam olarak` : issue.inclusive ? `en çok` : `altında`
        } ${issue.maximum} karakter girmelisiniz`;
      else if (issue.type === "number")
        message = `Değer ${
          issue.exact ? `tam olarak` : issue.inclusive ? `en çok` : `maksimum`
        } ${issue.maximum} olmalıdır`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${
          issue.exact
            ? `exactly`
            : issue.inclusive
            ? `less than or equal to`
            : `less than`
        } ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${
          issue.exact
            ? `exactly`
            : issue.inclusive
            ? `smaller than or equal to`
            : `smaller than`
        } ${new Date(Number(issue.maximum))}`;
      else message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};

export default errorMap;
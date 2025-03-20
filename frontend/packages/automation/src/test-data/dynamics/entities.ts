import { z } from "zod";

export type DynamicsEntity<T extends z.AnyZodObject = z.AnyZodObject> = {
  name: string;
  schema: T;
};

/**
 * NOTE: This is a subset of the actual entity, not all fields have been included
 * @see https://racwa-sit.crm6.dynamics.com/api/data/v9.2/contacts?$top=1
 */
export const DynamicsContactEntity = {
  name: "contacts",
  schema: z.object({
    /** Person/CRM ID */
    contactid: z.string().nullable(),
    /** Rac ID */
    rac_membershipnumber: z.string().nullable(),
    rac_preferredshieldcontact: z.string().nullable(),
    /** Login Object ID */
    rac_azure_ad_b2c_id: z.string().nullable(),
    rac_class: z.string().nullable(),
    _rac_tierid_value: z.string().nullable(),
    _rac_membershiptype_value: z.string().nullable(),
    fullname: z.string().nullable(),
    firstname: z.string().nullable(),
    middlename: z.string().nullable(),
    lastname: z.string().nullable(),
    rac_preferredname: z.string().nullable(),
    /** Title */
    rac_salutation: z.number().nullable(),
    rac_initials: z.string().nullable(),
    birthdate: z.string().nullable(),
    gendercode: z.number().nullable(),
    rac_age: z.string().nullable(),
    rac_details: z.string().nullable(),
    rac_preferredcontactmethod: z.number().nullable(),
    /** Personal email */
    emailaddress1: z.string().nullable(),
    /** Work email */
    emailaddress2: z.string().nullable(),
    /** Login email */
    emailaddress3: z.string().nullable(),
    /** Work phone */
    telephone1: z.string().nullable(),
    /** Home phone */
    telephone2: z.string().nullable(),
    mobilephone: z.string().nullable(),
    rac_buildingname: z.string().nullable(),
    rac_subbuildingnumber: z.string().nullable(),
    rac_blocknumber: z.string().nullable(),
    /** Unit number */
    rac_unitflat: z.string().nullable(),
    /** House number */
    address1_line1: z.string().nullable(),
    /** Street name */
    address1_line2: z.string().nullable(),
    /** PO box */
    address1_postofficebox: z.string().nullable(),
    /** Suburb */
    address1_city: z.string().nullable(),
    rac_state: z.string().nullable(),
    /** Postcode */
    address1_postalcode: z.string().nullable(),
    address1_country: z.string().nullable(),
    rac_postaladdress: z.string().nullable(),
    rac_postalcountrycode: z.string().nullable(),
    /** QAS validated */
    rac_validateaddress: z.boolean().nullable(),
    /**
     * Comma separate list of products
     * @example "MGP331636585, HGP332235735, RSA122231676-1"
     */
    rac_productnumbers: z.string().nullable(),
    rac_nexttenureupdate: z.string().nullable(),
    anniversary: z.string().nullable(),
    rac_memberjoindate: z.string().nullable(),
    rac_is_vulnerable_member: z.boolean().nullable(),
    rac_deceased: z.boolean().nullable(),
    rac_horizonsflag: z.number().nullable(),
    rac_suspendhorizonsmagazineflag: z.boolean().nullable(),
    rac_hearingimpairedflag: z.boolean().nullable(),
    rac_interpreterrequired: z.number().nullable(),
    rac_suspendmailflag: z.boolean().nullable(),
    rac_eligibletovote: z.boolean().nullable(),
    rac_oktomarketflag: z.boolean().nullable(),
    rac_incomeprotection: z.boolean().nullable(),
    rac_membershipcardnumber: z.string().nullable(),
    marketingonly: z.boolean().nullable(),
    rac_tenure: z.number().nullable(),
    rac_barcode: z.string().nullable(),
    rac_cardissuenumber: z.number().nullable(),
    rac_triggershieldcontactsync: z.boolean().nullable(),
    rac_lastskillid: z.string().nullable(),
    rac_dpid: z.string().nullable(),
    /** 🤣 */
    rac_isfunctionapp: z.boolean().nullable(),
  }),
} as const satisfies DynamicsEntity;

/**
 * NOTE: This is a subset of the actual entity, not all fields have been included
 * @see https://racwa-sit.crm6.dynamics.com/api/data/v9.2/rac_productholdings?$top=1
 */
export const DynamicsProductHoldingEntity = {
  name: "rac_productholdings",
  schema: z.object({
    createdon: z.string().nullable(),
    modifiedon: z.string().nullable(),
    statuscode: z.number().nullable(),
    _rac_personid_value: z.string(),
    _rac_company_value: z.string().nullable(),
    rac_name: z.string().nullable(),
    rac_productholdingheaderid: z.string(),
    rac_policynumber: z.string(),
    rac_upn: z.string().nullable(),
    rac_productbusinesstype: z.string().nullable(),
    rac_versionnumber: z.number().nullable(),
    rac_renewalnumber: z.string().nullable(),
    rac_startdate: z.string().nullable(),
    rac_duedate: z.string().nullable(),
    rac_paymmode: z.string().nullable(),
    rac_paymschedule: z.string().nullable(),
    rac_isdirectdebit: z.boolean().nullable(),
    rac_totalamount: z.number().nullable(),
    rac_paymentoverdue: z.boolean().nullable(),
    rac_asset: z.string().nullable(),
    rac_vehiclerego: z.string().nullable(),
    rac_vehicleyear: z.string().nullable(),
    rac_vehiclemake: z.string().nullable(),
    rac_vehiclemodel: z.string().nullable(),
    rac_vehiclebody: z.string().nullable(),
    rac_vehiclevariant: z.string().nullable(),
    rac_vehiclecolour: z.string().nullable(),
    rac_vehiclevin: z.string().nullable(),
    rac_vehiclenvic: z.string().nullable(),
  }),
} as const satisfies DynamicsEntity;

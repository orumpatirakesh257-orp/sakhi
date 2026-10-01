/**
 * scheme.js - Official Knowledge Base for Pradhan Mantri Matru Vandana Yojana (PMMVY)
 * 
 * Scheme: Pradhan Mantri Matru Vandana Yojana (PMMVY) - Centrally Sponsored Maternity Benefit Scheme
 * Ministry: Ministry of Women and Child Development (MWCD), Government of India
 * Implementation Umbrella: Mission Shakti (Samarthya sub-scheme)
 * 
 * NOTE FOR VERIFICATION:
 * Every amount, installment condition, date limit, and eligibility rule is annotated
 * with "// VERIFY at official PMMVY site / myscheme.gov.in" as required.
 */

export const PMMVY_KNOWLEDGE_BASE = `
SCHEME OVERVIEW:
Pradhan Mantri Matru Vandana Yojana (PMMVY) is a direct benefit transfer (DBT) maternity benefit scheme provided by the Ministry of Women and Child Development, Government of India.

1. PURPOSE & GOAL:
- To provide partial wage compensation in cash to pregnant women and lactating mothers so that the woman can take adequate rest before and after delivery of the child. // VERIFY at official PMMVY site / myscheme.gov.in
- To improve health-seeking behavior, encourage early pregnancy registration, promote institutional delivery, and support nutrition during pregnancy and lactation. // VERIFY at official PMMVY site / myscheme.gov.in

2. WHO IS ELIGIBLE:
- Pregnant Women and Lactating Mothers (PW&LM) who are Indian citizens. // VERIFY at official PMMVY site / myscheme.gov.in
- The mother must be at least 19 years of age at the time of pregnancy. // VERIFY at official PMMVY site / myscheme.gov.in
- Scheme applies to:
  * First living child of the mother (for any gender). // VERIFY at official PMMVY site / myscheme.gov.in
  * Second child ONLY IF the second newborn child is a girl child (to prevent female foeticide and encourage the girl child under PMMVY 2.0 / Mission Shakti guidelines). // VERIFY at official PMMVY site / myscheme.gov.in

3. WHO IS NOT ELIGIBLE (EXCLUSIONS):
- Women who are regular employees of the Central Government, State Governments, or Public Sector Undertakings (PSUs). // VERIFY at official PMMVY site / myscheme.gov.in
- Women who are in receipt of similar maternity benefits under any other statutory law or scheme for the time being in force. // VERIFY at official PMMVY site / myscheme.gov.in
- Women having a second child if the second child is a boy (only the girl child is eligible for the second pregnancy benefit). // VERIFY at official PMMVY site / myscheme.gov.in
- Women under 19 years of age. // VERIFY at official PMMVY site / myscheme.gov.in

4. CASH BENEFIT & INSTALLMENT STRUCTURE:
A. FIRST CHILD BENEFIT (Total: ₹5,000 in 2 installments): // VERIFY at official PMMVY site / myscheme.gov.in
   - Installment 1: ₹3,000 // VERIFY at official PMMVY site / myscheme.gov.in
     * Condition: Early registration of pregnancy at the Anganwadi Centre / Health Facility (within 570 days / ~6 months of Last Menstrual Period - LMP) and completion of at least ONE Ante-Natal Check-up (ANC). // VERIFY at official PMMVY site / myscheme.gov.in
   - Installment 2: ₹2,000 // VERIFY at official PMMVY site / myscheme.gov.in
     * Condition: Registration of child's birth and completion of first cycle of immunizations (BCG, OPV, DPT/Pentavalent, Hepatitis B or government equivalent). // VERIFY at official PMMVY site / myscheme.gov.in

B. SECOND CHILD BENEFIT (ONLY IF SECOND CHILD IS A GIRL): // VERIFY at official PMMVY site / myscheme.gov.in
   - Benefit: Lump-sum cash benefit of ₹6,000 in ONE installment. // VERIFY at official PMMVY site / myscheme.gov.in
   - Condition: Registration of birth of the female child and completion of first cycle of child vaccination. // VERIFY at official PMMVY site / myscheme.gov.in

C. LINKAGE WITH INSTITUTIONAL DELIVERY (JANANI SURAKSHA YOJANA - JSY): // VERIFY at official PMMVY site / myscheme.gov.in
   - In addition to PMMVY, if delivery takes place in a government hospital or accredited private facility, the mother receives JSY cash incentive (usually ₹1,400 in rural areas or ₹1,000 in urban areas). // VERIFY at official PMMVY site / myscheme.gov.in
   - Combined maternity assistance can reach up to ₹6,000 - ₹7,400. // VERIFY at official PMMVY site / myscheme.gov.in

5. DOCUMENTS NEEDED (WHAT TO CARRY):
- Mother's Aadhaar Card (mandatory for DBT transfer). // VERIFY at official PMMVY site / myscheme.gov.in
- Mother's Bank Account Passbook or Post Office Account details (Must be an individual account in the mother's name, active, and Aadhaar-seeded / linked with DBT). // VERIFY at official PMMVY site / myscheme.gov.in
- Mother and Child Protection (MCP) Card / Mamta Card / RCH Register Card issued by health worker / Anganwadi. // VERIFY at official PMMVY site / myscheme.gov.in
- Valid mobile phone number (to receive SMS updates on application and payment). // VERIFY at official PMMVY site / myscheme.gov.in
- For 2nd child girl benefit: Birth Certificate of the baby girl showing date and gender. // VERIFY at official PMMVY site / myscheme.gov.in

6. WHERE TO APPLY & WHO TO CONTACT (WHERE TO GO / WHO TO ASK):
- Nearest Anganwadi Centre (AWC) in the village/slum/ward. Contact the Anganwadi Worker (AWW) or Anganwadi Helper. // VERIFY at official PMMVY site / myscheme.gov.in
- ASHA worker (Accredited Social Health Activist) in the community. // VERIFY at official PMMVY site / myscheme.gov.in
- Government Primary Health Centre (PHC), Community Health Centre (CHC), or District Hospital. // VERIFY at official PMMVY site / myscheme.gov.in
- Online citizen portal: pmmvy.wcd.gov.in (can be accessed with help from Anganwadi worker or Common Service Centre). // VERIFY at official PMMVY site / myscheme.gov.in

7. STRICT NO-FEE RULE & ANTI-FRAUD WARNING (CRITICAL):
- PMMVY APPLICATION IS 100% FREE OF COST. // VERIFY at official PMMVY site / myscheme.gov.in
- NO government worker, doctor, ASHA, or Anganwadi worker is allowed to charge any fee or cut. // VERIFY at official PMMVY site / myscheme.gov.in
- BEWARE OF MIDDLEMEN / DALALS: No agent or middleman can speed up payments. The money comes DIRECTLY into the mother's bank account through Direct Benefit Transfer (DBT). // VERIFY at official PMMVY site / myscheme.gov.in
- NEVER share bank PIN or OTP with anyone. // VERIFY at official PMMVY site / myscheme.gov.in
`;

// Export plain text version and structured helper for client and server usage
export default PMMVY_KNOWLEDGE_BASE;

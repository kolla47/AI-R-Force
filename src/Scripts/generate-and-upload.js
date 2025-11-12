import { AzureOpenAI } from "openai";
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

// 3. Your data
const documents = [
  {
    id: "kb-001",
    title: "In-Flight Service Issues",
    tags: [
      "in-flight service",
      "customer service",
      "compensation",
      "customer complaint",
    ],
    status: "published",
    vector: [],
    KB: "# In-Flight Service Issues\n\n## Quick Reference\n**Issue Type:** In-Flight Service Complaint\n**Flight Type:** Domestic & International\n**Average Resolution:** 5 business days\n**Success Rate:** 85%\n\n## Common Causes\n- Poor cabin crew service (attitude, responsiveness)\n- Inadequate meal options or quality\n- Entertainment system malfunctions\n- Cleanliness or comfort issues (e.g., seat condition)\n\n## Investigation Steps\n\n### Initial Review (0–2 hours)\n1. Confirm flight details and PNR\n2. Request customer description of the issue\n3. Check crew reports or logs for service notes\n4. Verify if issue was reported during the flight\n\n### Eligibility Assessment (2–6 hours)\n1. Refer to in-flight service policy and compensation guidelines\n2. Determine if issue significantly impacted travel experience\n3. Review customer status (e.g., elite tier, special needs)\n4. Assess if compensation or goodwill gesture is warranted\n\n## Resolution Methods\n- **Compensation:** Vouchers or miles for poor service experience\n- **Apology Letter:** For minor issues with no compensation offered\n- **Goodwill Gesture:** For non-compensable but valid complaints\n\n## Compensation Framework\n- **Severe Disruption:** Eligible for compensation if service was unacceptable\n- **Minor Inconvenience:** Goodwill gesture may apply based on case review\n- **Processing Time:** 5 business days average\n- **Documentation Required:** Flight details, description of issue, any supporting evidence (photos, etc.)\n\n## Escalation Triggers\n- Service issue affected medical or special needs passengers\n- Business or premium class service failure\n- VIP or elite status passengers with significant complaints\n- Disputes over compensation eligibility or amount offered\n\n## Required Documentation\n- Flight ticket and boarding pass\n- Description of service issue and any supporting evidence (photos, etc.)\n- Customer contact details for follow-up",
  },
  {
    id: "kb-002",
    title: "Flight Delays – All Routes",
    tags: [
      "flight delay",
      "missed connection",
      "compensation",
      "rebooking",
      "customer complaint",
    ],
    status: "published",
    vector: [],
    KB: "# Flight Delays – All Routes\n\n## Quick Reference\n**Issue Type:** Flight Delay\n**Flight Type:** Domestic & International\n**Average Resolution:** 7 business days\n**Success Rate:** 90%\n\n## Common Causes\n- Aircraft maintenance or technical issues\n- Crew availability delays\n- Weather disruptions\n- Air traffic control restrictions\n- Late arrival of inbound aircraft\n\n## Investigation Steps\n\n### Initial Review (0-2 hours)\n1. Confirm flight number, date, and PNR\n2. Check actual delay duration and reason via flight status tools\n3. Review internal logs for delay classification (controllable vs. uncontrollable)\n4. Identify if customer missed a connection or incurred extra expenses\n\n### Eligibility Assessment (2-6 hours)\n1. Refer to airline compensation policy (EU261, DGCA, etc.)\n2. Determine if delay exceeds compensation threshold (e.g., 3+ hours)\n3. Check if delay was within airline control\n4. Request supporting documents (receipts, alternate bookings)\n\n## Resolution Methods\n- **Compensation:** Vouchers, miles, or partial refunds based on eligibility\n- **Rebooking:** Free rebooking on next available flight\n- **Goodwill Gesture:** Offered when compensation is not applicable but inconvenience is acknowledged\n\n## Compensation Framework\n- **Delay >3 hours (controllable):** Eligible for compensation\n- **Missed Connection:** Rebooking + hotel/accommodation if applicable\n- **Expenses:** Reimbursement for meals, transport with valid receipts\n- **Processing Time:** 7 business days average\n\n## Escalation Triggers\n- Delay caused missed international connection\n- Customer incurred high expenses\n- VIP or elite status passengers\n- Medical or emergency travel impacted\n\n## Required Documentation\n- Flight ticket and boarding pass\n- Receipts for expenses\n- Alternate travel arrangements (if any)\n- Customer contact details for follow-up",
  },
  {
    id: "kb-003",
    title: "Flight Cancellations – All Routes",
    tags: [
      "flight cancellation",
      "refund",
      "rebooking",
      "compensation",
      "customer complaint",
    ],
    status: "published",
    vector: [],
    KB: "# Flight Cancellations – All Routes\n\n## Quick Reference\n**Issue Type:** Flight Cancellation\n**Flight Type:** Domestic & International\n**Average Resolution:** 10 business days\n**Success Rate:** 92%\n\n## Common Causes\n- Operational disruptions (crew, aircraft availability)\n- Weather-related cancellations\n- Regulatory or airport restrictions\n- Technical or safety concerns\n\n## Investigation Steps\n\n### Initial Review (0-2 hours)\n1. Confirm flight number, date, and PNR\n2. Verify cancellation reason via internal operations log\n3. Check if customer was notified in advance\n4. Identify if alternate arrangements were offered\n\n### Eligibility Assessment (2-6 hours)\n1. Refer to airline cancellation policy (EU261, DGCA, etc.)\n2. Determine if customer qualifies for refund, rebooking, or compensation\n3. Review customer impact (missed events, extra expenses)\n4. Request supporting documents if reimbursement is claimed\n\n## Resolution Methods\n- **Refund:** Full refund for unused ticket if no alternate flight accepted\n- **Rebooking:** Free rebooking on next available flight\n- **Compensation:** Vouchers or miles if cancellation was within airline control\n\n## Compensation Framework\n- **Advance Notice <14 days:** Eligible for compensation\n- **No Alternate Flight Offered:** Full refund\n- **Expenses:** Reimbursement for meals, transport, lodging with valid receipts\n- **Processing Time:** 10 business days average\n\n## Escalation Triggers\n- Cancellation caused missed international connection or event\n- High-value expenses incurred\n- VIP or elite status passengers\n- Medical or emergency travel impacted\n\n## Required Documentation\n- Flight ticket and cancellation notice\n- Receipts for expenses\n- Alternate travel arrangements (if any)\n- Customer contact details for follow-up",
  },
  {
    id: "kb-004",
    title: "Refund Inquiries – All Routes",
    tags: [
      "refund",
      "ticket cancellation",
      "payment issues",
      "customer complaint",
      "reimbursement",
    ],
    status: "published",
    vector: [],
    KB: "# Refund Inquiries – All Routes\n\n## Quick Reference\n**Issue Type:** Refund Request\n**Flight Type:** Domestic & International\n**Average Resolution:** 10 business days\n**Success Rate:** 88%\n\n## Common Causes\n- Flight cancellations by airline\n- Voluntary cancellations by passenger\n- Duplicate bookings or payment errors\n- Unused tickets due to medical or emergency reasons\n\n## Investigation Steps\n\n### Initial Review (0-2 hours)\n1. Confirm booking reference (PNR), flight details, and payment method\n2. Check ticket type (refundable vs. non-refundable)\n3. Verify cancellation status and reason\n4. Review refund request history and supporting documents\n\n### Eligibility Assessment (2-6 hours)\n1. Refer to fare rules and refund policy\n2. Determine if refund is full, partial, or not applicable\n3. Check if payment was made via travel agent or direct channel\n4. Request additional documentation if needed (e.g., medical certificate)\n\n## Resolution Methods\n- **Full Refund:** For refundable tickets or airline-initiated cancellations\n- **Partial Refund:** Based on fare rules and deductions\n- **Goodwill Refund:** For exceptional cases (medical, bereavement)\n- **Voucher Issuance:** If refund not applicable but goodwill gesture approved\n\n## Compensation Framework\n- **Refund Timeline:** 7–10 business days for processing\n- **Payment Method:** Refund issued to original payment source\n- **Service Fees:** May be deducted based on fare conditions\n- **Documentation Required:** Booking details, cancellation proof, receipts (if applicable)\n\n## Escalation Triggers\n- Refund pending beyond 15 business days\n- High-value bookings\n- VIP or elite status passengers\n- Disputes over refund amount or eligibility\n\n## Required Documentation\n- Booking confirmation and ticket number\n- Cancellation notice or reason\n- Payment receipt or transaction ID\n- Customer contact details for follow-up",
  },
  {
    id: "kb-005",
    title: "Missed Connections Due to Delays",
    tags: [
      "missed connection",
      "flight delay",
      "rebooking",
      "compensation",
      "customer complaint",
    ],
    status: "published",
    vector: [],
    KB: "# Missed Connections Due to Delays\n\n## Quick Reference\n**Issue Type:** Missed Connection\n**Flight Type:** Domestic & International\n**Average Resolution:** 8 business days\n**Success Rate:** 89%\n\n## Common Causes\n- Primary flight delayed beyond connection window\n- Gate changes or terminal transfers causing missed boarding\n- Short layover times not adjusted for delays\n- Weather or air traffic disruptions\n\n## Investigation Steps\n\n### Initial Review (0-2 hours)\n1. Confirm both flight segments and PNR\n2. Verify delay duration and cause of primary flight\n3. Check if connection was booked on a single itinerary\n4. Review rebooking or assistance provided at the airport\n\n### Eligibility Assessment (2-6 hours)\n1. Refer to missed connection policy (based on fare type and route)\n2. Determine if delay was within airline control\n3. Check if customer incurred additional expenses (hotel, meals, transport)\n4. Request supporting documents (receipts, alternate bookings)\n\n## Resolution Methods\n- **Rebooking:** Free rebooking on next available flight\n- **Accommodation:** Hotel and transport provided if overnight stay required\n- **Compensation:** Vouchers or miles if delay was controllable\n- **Goodwill Gesture:** Offered when policy does not cover but inconvenience is acknowledged\n\n## Compensation Framework\n- **Delay >3 hours (controllable):** Eligible for compensation\n- **Expenses:** Reimbursement with valid receipts\n- **Processing Time:** 8 business days average\n\n## Escalation Triggers\n- International missed connections with no rebooking\n- High-value expenses incurred\n- VIP or elite status passengers\n- Medical or emergency travel impacted\n\n## Required Documentation\n- Full itinerary and boarding passes\n- Receipts for expenses\n- Alternate travel arrangements (if any)\n- Customer contact details for follow-up",
  },
  {
    id: "kb-006",
    title: "Damaged Baggage – All Routes",
    tags: [
      "damaged baggage",
      "compensation",
      "reimbursement",
      "customer complaint",
      "baggage claim",
    ],
    status: "published",
    vector: [],
    KB: "# Damaged Baggage – All Routes\n\n## Quick Reference\n**Issue Type:** Damaged Baggage\n**Flight Type:** Domestic & International\n**Average Resolution:** 10 business days\n**Success Rate:** 93%\n\n## Common Causes\n- Mishandling during loading/unloading\n- Conveyor belt or transport vehicle damage\n- Weather exposure during transit\n- Security inspection-related damage\n\n## Investigation Steps\n\n### Initial Review (0-2 hours)\n1. Confirm flight details and PNR\n2. Verify baggage tag and damage report (PIR)\n3. Request photos of damaged baggage\n4. Check if damage was reported at the airport\n\n### Eligibility Assessment (2-6 hours)\n1. Refer to baggage damage policy and liability limits\n2. Determine if damage is covered (e.g., not wear and tear)\n3. Review customer status (e.g., elite tier, special handling)\n4. Request purchase receipt or estimated value if claim exceeds threshold\n\n## Resolution Methods\n- **Repair:** Offer repair service or reimbursement\n- **Replacement:** If repair not feasible, offer replacement or compensation\n- **Goodwill Gesture:** For minor damage not covered by policy\n\n## Compensation Framework\n- **Maximum Claim:** Based on Montreal Convention or airline limits\n- **Processing Time:** 10 business days average\n- **Documentation Required:** PIR, photos, receipts, contact details\n\n## Escalation Triggers\n- High-value items (electronics, business equipment)\n- Damage to medical or mobility devices\n- VIP or elite status passengers\n- Disputes over claim amount or eligibility\n\n## Required Documentation\n- Property Irregularity Report (PIR)\n- Photos of damaged baggage\n- Original baggage tag and boarding pass\n- Receipts or estimated value of contents\n- Customer contact details for follow-up",
  },
  {
    id: "kb-007",
    title: "Delayed Baggage – All Routes",
    tags: [
      "delayed baggage",
      "baggage tracking",
      "compensation",
      "customer complaint",
      "reimbursement",
    ],
    status: "published",
    vector: [],
    KB: "# Delayed Baggage – All Routes\n\n## Quick Reference\n**Issue Type:** Delayed Baggage\n**Flight Type:** Domestic & International\n**Average Resolution:** 12 business days\n**Success Rate:** 95%\n\n## Common Causes\n- Missed connections during transfers\n- Mishandling during loading/unloading\n- Routing errors in baggage system\n- Weather or security-related delays\n\n## Investigation Steps\n\n### Immediate Actions (0–2 hours)\n1. Confirm flight details and baggage tag number\n2. Check last scanned location in baggage tracking system\n3. File Property Irregularity Report (PIR) if not already done\n4. Contact arrival airport baggage services\n\n### Extended Search (2–24 hours)\n1. Trace bag through connecting airports\n2. Coordinate with ground handling teams\n3. Review security or customs hold notifications\n4. Confirm if bag was misrouted or left behind\n\n## Resolution Methods\n- **Located & Delivered:** Most common outcome\n- **Express Delivery:** For urgent cases\n- **Customer Pickup:** From designated airport counter\n\n## Compensation Framework\n- **Essential Items:** Up to $50/day for basic needs\n- **Delivery Costs:** Reimbursed if customer arranges courier\n- **Processing Time:** 12 business days average\n- **Maximum Claim:** Based on Montreal Convention or airline limits\n\n## Escalation Triggers\n- Bag missing for more than 72 hours\n- High-value or essential contents\n- VIP or elite status passengers\n- Medical necessity items\n\n## Required Documentation\n- Baggage claim tags\n- PIR reference number\n- Photos or list of contents\n- Receipts for emergency purchases\n- Customer contact details for delivery",
  },
  {
    id: "kb-008",
    title: "Reimbursement for Emergency Purchases",
    tags: [
      "emergency purchases",
      "delayed baggage",
      "reimbursement",
      "compensation",
      "customer complaint",
    ],
    status: "published",
    vector: [],
    KB: "# Reimbursement for Emergency Purchases\n\n## Quick Reference\n**Issue Type:** Emergency Purchase Reimbursement\n**Flight Type:** Domestic & International\n**Average Resolution:** 10 business days\n**Success Rate:** 91%\n\n## Common Causes\n- Delayed or lost baggage\n- Missed connections requiring overnight stay\n- Flight cancellations without prior notice\n- Medical or hygiene needs during travel disruptions\n\n## Investigation Steps\n\n### Initial Review (0–2 hours)\n1. Confirm flight details and PNR\n2. Verify related incident (e.g., delayed baggage, missed connection)\n3. Request receipts for emergency purchases\n4. Check if a Property Irregularity Report (PIR) or incident report was filed\n\n### Eligibility Assessment (2–6 hours)\n1. Refer to airline reimbursement policy for emergency expenses\n2. Determine if purchases were necessary and within allowable limits\n3. Review customer status (e.g., elite tier, special needs)\n4. Validate receipts and purchase dates against travel disruption timeline\n\n## Resolution Methods\n- **Reimbursement:** Full or partial based on policy limits\n- **Compensation:** Vouchers or miles if reimbursement not applicable\n- **Goodwill Gesture:** For borderline cases or minor policy exceptions\n\n## Compensation Framework\n- **Essential Items:** Up to $50/day for toiletries, clothing, medication\n- **Maximum Claim:** Based on airline or international travel regulations\n- **Processing Time:** 10 business days average\n- **Payment Method:** Refund to original payment source or travel credit\n\n## Escalation Triggers\n- High-value purchases\n- Medical or hygiene-related items\n- VIP or elite status passengers\n- Disputes over eligibility or amount\n\n## Required Documentation\n- Receipts for emergency purchases\n- PIR or incident report (if applicable)\n- Flight ticket and boarding pass\n- Customer contact details for follow-up",
  },
  {
    id: "kb-009",
    title: "Broken or Malfunctioning Seats",
    tags: [
      "seat issue",
      "broken seat",
      "malfunctioning seat",
      "compensation",
      "customer complaint",
    ],
    status: "published",
    vector: [],
    KB: "# Broken or Malfunctioning Seats\n\n## Quick Reference\n**Issue Type:** Seat Malfunction\n**Flight Type:** Domestic & International\n**Average Resolution:** 7 business days\n**Success Rate:** 87%\n\n## Common Causes\n- Recline mechanism failure\n- Inoperative tray tables or seatback screens\n- Loose or unstable seat frames\n- Seat not matching booking (e.g., aisle vs. window)\n\n## Investigation Steps\n\n### Initial Review (0–2 hours)\n1. Confirm flight details, seat number, and PNR\n2. Request customer description or photo of the issue\n3. Check crew or maintenance logs for reported seat faults\n4. Verify if alternate seating was offered during the flight\n\n### Eligibility Assessment (2–6 hours)\n1. Refer to seat-related service disruption policy\n2. Determine if issue significantly impacted comfort or safety\n3. Review customer status (e.g., elite tier, special needs)\n4. Assess if compensation or goodwill gesture is warranted\n\n## Resolution Methods\n- **Compensation:** Vouchers or miles for discomfort\n- **Apology Letter:** For minor issues with no compensation\n- **Goodwill Gesture:** For non-compensable but valid complaints\n\n## Compensation Framework\n- **Severe Disruption:** Eligible for compensation if seat was unusable\n- **Minor Inconvenience:** Goodwill gesture may apply\n- **Processing Time:** 7 business days average\n- **Documentation Required:** Seat number, flight details, description or photo\n\n## Escalation Triggers\n- Seat issue affected medical or special needs\n- Business or premium class seat malfunction\n- VIP or elite status passengers\n- Disputes over compensation eligibility\n\n## Required Documentation\n- Flight ticket and boarding pass\n- Seat number and description of issue\n- Photos (if available)\n- Customer contact details for follow-up",
  },
  {
    id: "kb-010",
    title: "Lost or Stolen Baggage",
    tags: [
      "lost baggage",
      "stolen baggage",
      "compensation",
      "reimbursement",
      "customer complaint",
    ],
    status: "published",
    vector: [],
    KB: "# Lost or Stolen Baggage\n\n## Quick Reference\n**Issue Type:** Lost or Stolen Baggage\n**Flight Type:** Domestic & International\n**Average Resolution:** 15 business days\n**Success Rate:** 85%\n\n## Common Causes\n- Mishandling during transfers or layovers\n- Incorrect routing or tag mismatch\n- Theft during transit or at destination airport\n- Baggage not loaded onto aircraft\n\n## Investigation Steps\n\n### Initial Review (0–2 hours)\n1. Confirm flight details and baggage tag number\n2. Check last scanned location in baggage tracking system\n3. File Property Irregularity Report (PIR) if not already done\n4. Contact arrival airport and ground handling teams\n\n### Extended Search (2–48 hours)\n1. Trace bag through all connection points\n2. Review CCTV or security logs if theft is suspected\n3. Coordinate with lost and found departments\n4. Confirm if bag was misrouted or retained for inspection\n\n## Resolution Methods\n- **Located & Returned:** If bag is found within 72 hours\n- **Declared Lost:** If not found after 21 days\n- **Compensation:** Based on declared value and airline liability limits\n\n## Compensation Framework\n- **Essential Items:** Reimbursement for emergency purchases\n- **Lost Baggage Claim:** Based on Montreal Convention or airline limits\n- **Processing Time:** 15 business days average\n- **Maximum Claim:** Varies by route and ticket type\n\n## Escalation Triggers\n- Bag missing for more than 72 hours\n- High-value or irreplaceable contents\n- VIP or elite status passengers\n- Medical or business-critical items\n\n## Required Documentation\n- PIR reference number\n- Baggage claim tags and boarding pass\n- Itemized list of contents with estimated values\n- Receipts for emergency purchases\n- Customer contact details for follow-up",
  },
  {
    id: "kb-011",
    title: "Voucher or Credit Issues",
    tags: [
      "voucher",
      "travel credit",
      "compensation",
      "redemption issue",
      "customer complaint",
    ],
    status: "published",
    vector: [],
    KB: "# Voucher or Credit Issues\n\n## Quick Reference\n**Issue Type:** Voucher or Travel Credit Problem\n**Flight Type:** Domestic & International\n**Average Resolution:** 7 business days\n**Success Rate:** 86%\n\n## Common Causes\n- Voucher not received after flight disruption\n- Travel credit expired or not redeemable\n- Incorrect voucher value issued\n- Technical issues during redemption\n\n## Investigation Steps\n\n### Initial Review (0–2 hours)\n1. Confirm customer identity and PNR\n2. Check voucher or credit issuance history\n3. Verify expiration date and usage status\n4. Review reason for original voucher issuance (e.g., delay, cancellation)\n\n### Eligibility Assessment (2–6 hours)\n1. Refer to voucher and credit policy\n2. Determine if issue is due to system error, expiration, or misuse\n3. Check if customer qualifies for reissuance or extension\n4. Request screenshots or error messages if redemption failed\n\n## Resolution Methods\n- **Reissue Voucher:** If original was not received or expired unfairly\n- **Extend Validity:** For unused vouchers within grace period\n- **Correct Value:** Adjust if issued incorrectly\n- **Goodwill Gesture:** If policy does not cover but inconvenience is valid\n\n## Compensation Framework\n- **Voucher Validity:** Typically 12 months from issue date\n- **Redemption Channels:** Website, app, or customer service\n- **Processing Time:** 7 business days average\n- **Documentation Required:** Voucher code, PNR, issue description\n\n## Escalation Triggers\n- Voucher tied to high-value booking\n- Redemption failed during urgent travel\n- VIP or elite status passengers\n- Disputes over voucher eligibility or value\n\n## Required Documentation\n- Original voucher or credit code\n- Flight ticket and PNR\n- Screenshots or error messages (if applicable)\n- Customer contact details for follow-up",
  },
  {
    id: "kb-012",
    title: "Entertainment System Not Working",
    tags: [
      "in-flight entertainment",
      "screen issue",
      "compensation",
      "customer complaint",
      "malfunction",
    ],
    status: "published",
    vector: [],
    KB: "# Entertainment System Not Working\n\n## Quick Reference\n**Issue Type:** In-Flight Entertainment Malfunction\n**Flight Type:** Domestic & International\n**Average Resolution:** 5 business days\n**Success Rate:** 85%\n\n## Common Causes\n- Faulty screen or audio jack\n- System reboot failure during flight\n- Seat-specific hardware malfunction\n- Connectivity issues with onboard server\n\n## Investigation Steps\n\n### Initial Review (0–2 hours)\n1. Confirm flight details, seat number, and PNR\n2. Request customer description of issue (e.g., screen blank, no sound)\n3. Check crew or maintenance logs for reported entertainment faults\n4. Verify if alternate entertainment options were offered (e.g., shared screen, magazines)\n\n### Eligibility Assessment (2–6 hours)\n1. Refer to in-flight service disruption policy\n2. Determine if issue significantly impacted passenger experience\n3. Review customer status (e.g., elite tier, long-haul flight)\n4. Assess if compensation or goodwill gesture is warranted\n\n## Resolution Methods\n- **Compensation:** Vouchers or miles for service disruption\n- **Apology Letter:** For minor issues with no compensation\n- **Goodwill Gesture:** For non-compensable but valid complaints\n\n## Compensation Framework\n- **Long-Haul Flights:** Eligible for compensation if system was unusable\n- **Short-Haul Flights:** Goodwill gesture may apply\n- **Processing Time:** 5 business days average\n- **Documentation Required:** Seat number, flight details, issue description\n\n## Escalation Triggers\n- Multiple seat issues reported on same flight\n- VIP or elite status passengers\n- Business or premium class affected\n- Disputes over compensation eligibility\n\n## Required Documentation\n- Flight ticket and boarding pass\n- Seat number and description of issue\n- Photos (if available)\n- Customer contact details for follow-up",
  },
];

const endpoint = process.env.REACT_APP_AZURE_GENERATION_ENDPOINT;

async function main() {
  const apiKey = process.env.REACT_APP_AZURE_EMBEDDING_API_KEY;
  const apiVersion = "2024-02-01";
  const deployment = process.env.REACT_APP_AZURE_EMBEDDING_DEPLOYMENT;
  const options = { endpoint, apiKey, deployment, apiVersion };
  // 1. Initialize Azure OpenAI Embeddings Client
  const openaiClient = new AzureOpenAI(options);

  // 2. Initialize Azure AI Search Client
  const searchClient = new SearchClient(
    process.env.REACT_APP_AZURE_SEARCH_ENDPOINT,
    process.env.REACT_APP_AZURE_SEARCH_INDEX,
    new AzureKeyCredential(
      process.env.REACT_APP_AZURE_SEARCH_KEY
    )
  );

  // 4. Generate embeddings
  console.log("🔤 Generating embeddings...");

  const textsToEmbed = documents.map((doc) => doc.KB); // Use KB content for embedding

  const result = await openaiClient.embeddings.create({
    input: textsToEmbed,
    model: deployment,
  });

  if (!result.data || result.data.length === 0) {
    throw new Error("No embeddings returned from Azure OpenAI.");
  }

  // Assign vectors to documents
  const docsWithVectors = documents.map((doc, i) => ({
    ...doc,
    vector: result.data[i].embedding, // assign generated vector
  }));

  console.log(`✅ Generated ${docsWithVectors.length} embeddings.`);

  // 5. Upload to Azure AI Search
  console.log("⬆️ Uploading to Azure AI Search...");

  await searchClient
    .uploadDocuments(docsWithVectors)
    .then(() => console.log("✅ Upload successful"))
    .catch((err) => {
      console.error("❌ Error uploading documents:", err);
      throw err;
    });
}

main().catch((err) => {
  console.error("❌ Error:", err);
});

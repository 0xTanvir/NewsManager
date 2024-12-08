package main

const (
	SYSTEM_PROMPT = `
<ypigeon_info>
YPigeon is an advanced news article summarization assistant designed to help journalists and news organizations efficiently process and summarize international news content. It maintains the highest standards of journalistic integrity while providing concise, accurate summaries of news articles.

Key Attributes:
- Professional and informative tone
- Strict fact-checking adherence
- Focus on international news
- English-language processing
- Journalist-centric output
</ypigeon_info>

<summary_requirements>
1. Metadata Requirements:
   - Source attribution with full publication name
   - Category tags: Primary and secondary topics
   - Geographic region coverage
   - Author attribution when available
   - Verification Status: Must indicate VERIFIED, DEVELOPING, UNVERIFIED, or DISPUTED

2. Summary Content Requirements:
- Length: 300-400 words
- Style: Neutral, journalistic tone
- Content Structure:
  - Opening statement capturing main news event
  - Supporting context and background
  - Impact assessment or implications
  - Future developments or next steps
- Must Include:
  - All significant statistics with original context
  - Key stakeholder positions or statements
  - Timeline of critical events
  - Relevant historical context
  - International implications
  - Economic impact (when applicable)
- Must Exclude:
  - Editorial commentary
  - Speculative content
  - Unverified claims without proper attribution
  - Personal opinions
  - Sensationalized language

3. Key Points Requirements
- Quantity: 3-5 main points
- Structure:
  - Each point must be self-contained and meaningful
  - Points should follow logical progression
- Content Requirements for Each Point:
  - Must capture a distinct aspect of the story
  - Must be supported by facts from the article
  - Must include relevant figures or statistics
  - Must maintain original context
  - Must indicate verification status if different from main story
- Essential Elements to Cover:
  - Primary news event or development
  - Most significant impact or change
  - Key stakeholder actions or reactions
  - Critical timeline elements
  - Major implications or consequences

4. Content Preservation:
   - Must retain all significant statistics with original context
   - Direct quotes must be preserved verbatim with proper attribution
   - Key dates and timeline information must be maintained
   - Numerical data must be presented with original units/currency

5. Professional Standards:
   - Maintain neutral, informative tone
   - Use journalistic style guidelines
   - Avoid editorialization
   - Preserve factual accuracy
   - Include source verification status
</summary_requirements>

<content_guidelines>
1. Fact-Checking Protocol:
   - Verify information against multiple sources
   - Flag unverified claims or disputed information
   - Indicate level of source reliability
   - Mark developing stories appropriately

2. Sensitive Content Handling:
   - Apply content warnings when necessary
   - Follow ethical journalism guidelines
   - Maintain neutrality in conflicting situations
   - Respect privacy and confidentiality
   - Handle diplomatic sensitivities appropriately

3. Statistical Data Processing:
   - Present numbers in consistent format
   - Include context for statistical comparisons
   - Maintain original source attribution
   - Flag preliminary or estimated figures
</content_guidelines>

<verification_protocol>
1. Source Verification Levels:
   - VERIFIED: Multiple reliable sources confirm
   - DEVELOPING: Single reliable source reports
   - UNVERIFIED: Reported but not confirmed
   - DISPUTED: Conflicting information exists

2. Content Warning Tags:
   - SENSITIVE: Contains sensitive content
   - GRAPHIC: Contains graphic descriptions
   - DEVELOPING: Story is still developing
   - CORRECTION: Updates to previous reporting
</verification_protocol>

	`
	USER_PROMPT = `
Source: CNN
Headline: International Criminal Court issues arrest warrant for Israeli Prime Minister
Story: <p>CNN — The International Criminal Court has issued arrest warrants for Israeli Prime Minister Benjamin Netanyahu, former Defense Minister Yoav Gallant, and a senior Hamas official, accusing them of war crimes during and after the October 7 attacks on Israel last year.</p>
<p>In a statement on Thursday, the Netherlands-based court said it found “reasonable grounds” to believe that Netanyahu bears criminal responsibility for war crimes including “starvation as a method of warfare” and “the crimes against humanity of murder, persecution, and other inhumane acts.”</p>
<p>The warrants mark a historic first, making Netanyahu the first Israeli leader summoned by an international court for alleged actions against Palestinians in the 76-year conflict. While ICC warrants don’t guarantee arrests, they could significantly restrict Netanyahu’s ability to travel to ICC member states.</p>
<p>The prime minister’s office dismissed the warrants as “absurd and antisemitic.”</p>
<p>“Israel utterly rejects the absurd and false actions and accusations against it by the International Criminal Court, which is a politically biased and discriminatory body,” his office said, adding that there is “no war more just… after the Hamas terrorist organization launched a murderous attack against it, carrying out the largest massacre against the Jewish people since the Holocaust.”</p>
<p>Netanyahu “will not yield to pressure, will not back down, and will not retreat until all the goals of the war set by Israel at the start of the campaign are achieved,” it said.</p>
<p>Israel, like the United States, is not a member of the ICC and has challenged the court’s jurisdiction over its actions in the conflict – a challenge the court rejected on Thursday. The ICC claims jurisdiction over territories Israel occupies, including Gaza, East Jerusalem, and the West Bank, following the Palestinian leadership’s formal agreement to be bound by the court’s founding principles in 2015.</p>
<p>The court on Thursday also issued a warrant for Hamas official Mohammed Diab Ibrahim Al-Masri, also known as Mohammed Deif, who Israel says was one of the masterminds of the October 7 attack. Israel said it killed him in an airstrike in July but Hamas hasn’t confirmed his death.</p>
<p>The ICC said it found “reasonable grounds” to believe that Deif was responsible for “crimes against humanity, including murder, extermination, torture, and rape and other form of sexual violence, as well as the war crimes of murder, cruel treatment, torture, taking hostages, outrages upon personal dignity, and rape and other form of sexual violence.”</p>
<p>Deif bears “criminal responsibility” for these crimes, the court said, having “committed the acts jointly and through others… having ordered or induced the commission of the crimes,” and for failing to “exercise proper control over forces under his effective command and control.”</p>
<p>The court added that there are “reasonable grounds to believe that the crimes against humanity were part of a widespread and systematic attack directed by Hamas and other armed groups against the civilian population of Israel.”</p>
<p>The ICC prosecutor had initially sought warrants for Hamas leaders Ismail Haniyeh and Yahya Sinwar, both of whom have since been killed by Israel. The court said applications for their warrants were withdrawn as a result.</p>
<p>Hamas welcomed the warrants against Israeli officials in a statement, but made no mention of the warrant issued for Deif.</p>
<p>“This… represents a significant historical precedent. It rectifies a longstanding course of historical injustice against our people and the suspicious negligence of the horrific violations they have endured over 76 years of fascist occupation,” it said, calling for all nations to cooperate in bringing the Israeli leaders to justice and “take immediate action to halt the genocide” in Gaza.</p>
<p>Hamas had condemned the ICC prosecutor’s decision to seek warrants against its leaders in May, saying it was an attempt to “equate victims with aggressors.”</p>
<p>The Biden administration has in the past come out strongly against the involvement of the ICC in investigating Israel’s war in Gaza, but said in the past it did not support sanctions against the international court.</p>
<p>In a statement in May, President Joe Biden said “the ICC prosecutor’s application for arrest warrants against Israeli leaders is outrageous.”</p>
<p>“And let me be clear: whatever this prosecutor might imply, there is no equivalence — none — between Israel and Hamas,” he said. “We will always stand with Israel against threats to its security.”</p>
<p>In early June, the House of Representatives passed a bill to sanction anyone involved with the ICC efforts “to investigate, arrest, detain, or prosecute any protected person of the United States and its allies.” It has not been brought to a vote in the Senate.</p>
<p>Incoming Senate Majority Leader John Thune on Sunday threatened to pursue sanctions against the ICC if the international court and “and its prosecutor do not reverse their outrageous and unlawful actions to pursue arrest warrants against Israeli officials.”</p>
<p>“If Majority Leader Schumer does not act, the Senate Republican majority will stand with our key ally Israel and make this – and other supportive legislation – a top priority in the next Congress,” he wrote in a post on X.</p>
<p>President-elect Donald Trump imposed sanctions on the former ICC chief prosecutor during his first term in office.</p>
<p>CNN has asked the State Department and NSC for comment on the ICC’s issuance of the arrest warrants Thursday.</p>
<p>Israeli President Isaac Herzog described the warrants as “a dark day for justice. A dark day for humanity.”</p>
<p>He said in a statement on X that “the outrageous decision at the ICC has turned universal justice into a universal laughing stock. It makes a mockery of the sacrifice of all those who fight for justice.”</p>
<p>The decision, he added, “ignores the basic fact that Israel was barbarically attacked and has the duty and right to defend its people. It ignores the fact that Israel is a vibrant democracy, acting under international humanitarian law, and going to great lengths to provide for the humanitarian needs of the civilian population.”</p>
<p>Recently appointed Israeli Foreign Minister Gideon Sa’ar said the ICC acted as a political tool serving the most extreme elements working to undermine peace, security, and stability in the Middle East.”</p>
<p>“From an ethical perspective, this is a moral aberration that turns good into evil and serves the forces of evil,” he said. “From a diplomatic perspective, issuing orders against a country acting according to international law is a reward and encouragement for the axis of evil (of Iran-led groups), which flagrantly and consistently violates it.”</p>
<p>Far-right Minister of National Security Itamar Ben Gvir condemned the ICC as “antisemitic from start to finish,” adding that Israel should respond by “applying sovereignty” to the occupied West Bank and building Jewish settlements in all the territories under Israel’s control.</p>
<p>Gallant served as defense minister until this month, when Netanyahu fired him after months of clashes over domestic politics and Israel’s war effort. The prime minister said at the time that “trust between me and the minister of defense has cracked.” Israel Katz, who served as foreign minister until then, became defense minister.</p>
<p>Eliav Lieblich, a professor of international law at Tel Aviv University, described the ICC’s decision as “the most dramatic legal development in Israel’s history.”</p>
<p>“Its immediate meaning is that the 124 state parties to the ICC, which include most of Israel’s closest allies, would be legally obligated to arrest Netanyahu and Gallant should they be present in their territories,” Lieblich told CNN.</p>
<p>There may also be wider implications, he added, which “could limit the ability of third parties to cooperate with” the Israeli military.</p>
<p>After an arrest warrant has been issued, the ICC sends requests for cooperation to member states. The court does not have a police force of its own to make the arrests, but relies on member states to execute them, which state parties are legally obliged to do.</p>
<p>Previous leaders who have been faced with ICC arrest warrants have experienced limitations on their ability to travel, unable to pass through countries legally obliged to arrest them.</p>
<p>ICC judges have issued 56 arrest warrants, resulting in 21 detentions and appearances before the court. Another 27 people remain at large and charges have been dropped against 7 people due to their deaths.</p>
<p>CNN’s Jennifer Hansler, Samantha Waldenberg and Kareem Khadder contributed to this report.</p>
	`
)
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Result } from 'src/app/models/vektor';

// Type declarations for Clipboard API
// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
interface Clipboard {
  writeText(newClipText: string): Promise<void>;
  // Add any other methods you need here.
  readText();
  addEventListener();
  dispatchEvent();
  removeEventListener();
}
interface NavigatorClipboard extends Navigator {
  // Only available in a secure context.
  readonly clipboard: Clipboard;
}
interface NavigatorExtended extends NavigatorClipboard { }

export class MatchResult {
  home: string;
  visitor: string;
  ballsHome: number;
  ballsVisitor: number;
  result?: Result;
  homeTotal?: string;
  homeIn?: string;
  visitorTotal?: string;
  visitorOut?: string;

  constructor (matchStr: string) {
    const matchRegexp = /(.*)\s-\s(.*)\s*(\d+):(\d+)/;
    const parsedData = matchStr.match(matchRegexp);
    this.home = parsedData[1].trim();
    this.visitor = parsedData[2].trim();
    this.ballsHome = parseInt(parsedData[3], 10);
    this.ballsVisitor = parseInt(parsedData[4], 10);
    this.result = Result.Win;

    if (this.ballsHome === this.ballsVisitor) {
      this.result = Result.Equal;
    }

    if (this.ballsHome < this.ballsVisitor) {
      this.result = Result.Lose;
    }
  }

  display() {
    console.log(`Home: ${this.home}, visitor: ${this.visitor}, balls: ${this.ballsHome}:${this.ballsVisitor}, result: ${this.result}`);
  }
}

@Component({
  selector: 'app-base-builder',
  templateUrl: './base-builder.component.html',
  styleUrls: ['./base-builder.component.css']
})
export class BaseBuilderComponent implements OnInit {
  form: FormGroup;
  jsonStr: string;
  copyDone: string;

  constructor() {
    this.form = new FormGroup({
      raw: new FormControl(`30. ROUND	1	X	2	 
Brann - Odd	1:0	  1.58  	3.99	5.53	24.11.2018
Haugesund - Start	3:1	  2.24  	3.49	3.02	24.11.2018
Lillestrom - Kristiansund	2:0	  1.54  	4.36	5.41	24.11.2018
Rosenborg - Bodo/Glimt	1:1	1.71	  3.62  	4.92	24.11.2018
Sandefjord - Molde	1:3	5.87	4.47	  1.50  	24.11.2018
Stabaek - Stromsgodset	2:2	2.30	  3.48  	2.94	24.11.2018
Tromso - Sarpsborg 08	0:2	2.41	3.54	  2.74  	24.11.2018
Valerenga - Ranheim	2:1	  1.61  	4.15	5.03	24.11.2018
29. ROUND	1	X	2	 
Bodo/Glimt - Valerenga	1:1	1.71	  3.92  	4.50	11.11.2018
Kristiansund - Brann	3:1	  3.33  	3.61	2.06	11.11.2018
Molde - Haugesund	2:0	  1.48  	4.32	6.39	11.11.2018
Odd - Stabaek	0:3	2.03	3.71	  3.31  	11.11.2018
Ranheim - Tromso	1:2	2.24	3.57	  2.98  	11.11.2018
Sarpsborg 08 - Sandefjord	1:1	1.70	  3.86  	4.61	11.11.2018
Start - Rosenborg	0:1	4.33	3.49	  1.83  	11.11.2018
Stromsgodset - Lillestrom	2:2	2.03	  3.51  	3.48	11.11.2018
28. ROUND	1	X	2	 
Lillestrom - Bodo/Glimt	1:1	2.05	  3.35  	3.61	05.11.2018
Brann - Stromsgodset	3:1	  1.72  	3.80	4.61	04.11.2018
Haugesund - Ranheim	2:0	  1.61  	4.03	5.15	04.11.2018
Rosenborg - Odd	3:1	  1.41  	4.63	7.42	04.11.2018
Sandefjord - Start	4:1	  2.79  	3.38	2.44	04.11.2018
Tromso - Molde	2:4	3.73	3.71	  1.91  	04.11.2018
Valerenga - Sarpsborg 08	0:0	2.03	  3.50  	3.51	04.11.2018
Stabaek - Kristiansund	0:1	1.70	3.85	  4.63  	03.11.2018
27. ROUND	1	X	2	 
Start - Molde	1:3	4.58	3.80	  1.72  	29.10.2018
Bodo/Glimt - Stabaek	1:1	1.80	  3.79  	4.10	28.10.2018
Brann - Rosenborg	1:2	2.60	3.33	  2.66  	28.10.2018
Kristiansund - Sandefjord	3:2	  1.82  	3.75	4.05	28.10.2018
Odd - Tromso	1:0	  1.81  	3.76	4.10	28.10.2018
Ranheim - Lillestrom	3:2	  2.91  	3.43	2.34	28.10.2018
Sarpsborg 08 - Haugesund	2:1	  1.99  	3.40	3.78	28.10.2018
Stromsgodset - Valerenga	2:0	  2.07  	3.62	3.29	27.10.2018
26. ROUND	1	X	2	 
Haugesund - Odd	2:0	  2.01  	3.40	3.67	21.10.2018
Lillestrom - Rosenborg	0:0	2.84	  3.37  	2.41	21.10.2018
Ranheim - Bodo/Glimt	0:0	2.95	  3.44  	2.31	21.10.2018
Stabaek - Brann	1:2	2.95	3.37	  2.33  	21.10.2018
Tromso - Start	1:2	2.21	3.38	  3.18  	21.10.2018
Valerenga - Kristiansund	0:2	1.54	4.26	  5.64  	21.10.2018
Molde - Sarpsborg 08	2:2	1.48	  4.19  	6.51	20.10.2018
Sandefjord - Stromsgodset	2:1	  3.32  	3.53	2.09	20.10.2018
25. ROUND	1	X	2	 
Bodo/Glimt - Molde	0:1	3.23	3.49	  2.14  	07.10.2018
Brann - Lillestrom	1:1	1.71	  3.74  	4.74	07.10.2018
Kristiansund - Tromso	5:1	  2.30  	3.40	2.99	07.10.2018
Odd - Ranheim	2:0	  1.68  	3.82	4.81	07.10.2018
Rosenborg - Sandefjord	1:1	1.38	  4.90  	7.35	07.10.2018
Start - Sarpsborg 08	1:0	  2.58  	3.32	2.68	07.10.2018
Stabaek - Valerenga	1:1	2.66	  3.45  	2.51	06.10.2018
Stromsgodset - Haugesund	0:1	1.74	3.77	  4.51  	06.10.2018
24. ROUND	1	X	2	 
Tromso - Brann	2:1	  2.91  	3.30	2.40	01.10.2018
Haugesund - Bodo/Glimt	1:0	  2.02  	3.46	3.55	30.09.2018
Lillestrom - Stabaek	3:2	  1.94  	3.55	3.70	30.09.2018
Molde - Rosenborg	1:0	  2.28  	3.45	2.97	30.09.2018
Ranheim - Kristiansund	2:1	  2.13  	3.40	3.31	30.09.2018
Sarpsborg 08 - Stromsgodset	0:1	1.88	3.67	  3.85  	30.09.2018
Valerenga - Start	3:2	  1.57  	3.97	5.73	30.09.2018
Sandefjord - Odd	1:1	2.99	  3.28  	2.34	29.09.2018
23. ROUND	1	X	2	 
Lillestrom - Tromso	1:0	  1.81  	3.85	4.02	24.09.2018
Bodo/Glimt - Start	1:2	1.63	3.83	  5.32  	23.09.2018
Brann - Sandefjord	1:1	1.41	  4.52  	7.67	23.09.2018
Kristiansund - Haugesund	2:1	  2.58  	3.34	2.67	23.09.2018
Rosenborg - Sarpsborg 08	3:1	  1.54  	3.96	6.27	23.09.2018
Stabaek - Ranheim	3:2	  1.81  	3.76	4.10	23.09.2018
Stromsgodset - Molde	1:2	2.58	3.47	  2.60  	23.09.2018
Odd - Valerenga	3:2	  2.53  	3.40	2.68	22.09.2018
22. ROUND	1	X	2	 
Molde - Kristiansund	3:2	  1.42  	4.52	7.19	17.09.2018
Ranheim - Stromsgodset	1:1	2.93	  3.54  	2.29	16.09.2018
Sandefjord - Bodo/Glimt	1:1	3.34	  3.45  	2.12	16.09.2018
Sarpsborg 08 - Odd	1:2	1.94	3.50	  3.83  	16.09.2018
Start - Lillestrom	3:0	  2.69  	3.34	2.57	16.09.2018
Tromso - Stabaek	0:0	1.98	  3.62  	3.60	16.09.2018
Valerenga - Rosenborg	2:3	3.17	3.49	  2.17  	16.09.2018
Haugesund - Brann	1:3	2.76	3.27	  2.55  	15.09.2018
21. ROUND	1	X	2	 
Bodo/Glimt - Sarpsborg 08	3:1	  2.04  	3.45	3.57	02.09.2018
Brann - Ranheim	1:0	  1.47  	4.22	6.95	02.09.2018
Kristiansund - Start	1:1	1.96	  3.44  	3.83	02.09.2018
Lillestrom - Valerenga	0:1	2.32	3.45	  2.93  	02.09.2018
Odd - Molde	1:1	2.87	  3.46  	2.37	02.09.2018
Rosenborg - Haugesund	1:0	  1.51  	4.19	6.24	02.09.2018
Stabaek - Sandefjord	3:3	1.70	  3.79  	4.84	01.09.2018
Stromsgodset - Tromso	2:4	1.59	4.16	  5.16  	01.09.2018
20. ROUND	1	X	2	 
Start - Odd	0:1	2.88	3.30	  2.44  	27.08.2018
Haugesund - Stabaek	2:0	  1.96  	3.63	3.61	26.08.2018
Molde - Ranheim	2:3	1.37	4.78	  8.07  	26.08.2018
Rosenborg - Stromsgodset	4:3	  1.43  	4.49	7.15	26.08.2018
Sandefjord - Lillestrom	1:3	2.97	3.35	  2.35  	26.08.2018
Sarpsborg 08 - Kristiansund	1:2	2.05	3.42	  3.55  	26.08.2018
Valerenga - Brann	2:0	  2.44  	3.36	2.81	26.08.2018
Tromso - Bodo/Glimt	1:2	2.21	3.51	  3.09  	25.08.2018
19. ROUND	1	X	2	 
Bodo/Glimt - Odd	1:1	1.91	  3.69  	3.75	20.08.2018
Brann - Sarpsborg 08	2:0	  1.71  	3.74	4.76	19.08.2018
Kristiansund - Rosenborg	0:2	5.31	3.99	  1.61  	19.08.2018
Lillestrom - Haugesund	1:1	2.08	  3.50  	3.40	19.08.2018
Ranheim - Sandefjord	1:1	2.00	  3.47  	3.67	19.08.2018
Stabaek - Molde	3:1	  2.98  	3.57	2.25	19.08.2018
Stromsgodset - Start	1:1	1.36	  5.00  	7.72	19.08.2018
Valerenga - Tromso	3:0	  1.95  	3.70	3.61	19.08.2018
18. ROUND	1	X	2	 
Haugesund - Valerenga	1:0	  1.91  	3.74	3.69	13.08.2018
Bodo/Glimt - Kristiansund	3:0	  1.87  	3.68	3.90	12.08.2018
Molde - Brann	5:1	  2.02  	3.49	3.57	12.08.2018
Odd - Stromsgodset	2:2	2.41	  3.46  	2.80	12.08.2018
Rosenborg - Stabaek	1:1	1.31	  5.30  	9.15	12.08.2018
Sarpsborg 08 - Lillestrom	2:0	  2.06  	3.57	3.37	12.08.2018
Start - Ranheim	0:0	2.08	  3.49  	3.41	12.08.2018
Sandefjord - Tromso	1:0	  2.99  	3.39	2.31	10.08.2018
17. ROUND	1	X	2	 
Brann - Start	4:1	  1.36  	4.68	8.59	06.08.2018
Kristiansund - Odd	1:1	2.27	  3.33  	3.10	05.08.2018
Lillestrom - Molde	2:2	3.14	  3.49  	2.17	05.08.2018
Stabaek - Sarpsborg 08	1:3	2.72	3.36	  2.51  	05.08.2018
Stromsgodset - Bodo/Glimt	4:0	  1.58  	4.17	5.27	05.08.2018
Tromso - Haugesund	1:2	2.02	3.54	  3.49  	05.08.2018
Valerenga - Sandefjord	2:2	1.52	  4.22  	6.01	05.08.2018
Ranheim - Rosenborg	1:3	4.46	3.71	  1.76  	04.08.2018
16. ROUND	1	X	2	 
Stromsgodset - Kristiansund	2:3	1.56	4.15	  5.55  	09.07.2018
Bodo/Glimt - Brann	2:2	2.79	  3.23  	2.51	08.07.2018
Haugesund - Sandefjord	4:2	  1.47  	4.10	7.05	08.07.2018
Molde - Valerenga	5:1	  1.70  	3.80	4.66	08.07.2018
Odd - Lillestrom	3:1	  1.99  	3.52	3.60	08.07.2018
Sarpsborg 08 - Ranheim	4:1	  1.61  	3.94	5.35	08.07.2018
Start - Stabaek	2:1	  2.45  	3.41	2.75	08.07.2018
Rosenborg - Tromso	2:1	  1.46  	4.41	6.62	07.07.2018
15. ROUND	1	X	2	 
Lillestrom - Stromsgodset	1:1	2.56	  3.48  	2.58	02.07.2018
Brann - Molde	0:4	1.96	3.34	  3.92  	01.07.2018
Kristiansund - Sarpsborg 08	1:1	2.67	  3.32  	2.58	01.07.2018
Ranheim - Start	2:0	  1.92  	3.52	3.86	01.07.2018
Sandefjord - Rosenborg	0:1	6.65	4.21	  1.48  	01.07.2018
Stabaek - Haugesund	2:1	  2.44  	3.40	2.74	01.07.2018
Tromso - Odd	2:1	  2.04  	3.48	3.52	01.07.2018
Valerenga - Bodo/Glimt	2:2	2.07	  3.43  	3.46	30.06.2018
14. ROUND	1	X	2	 
Odd - Brann	0:1	2.65	3.18	  2.70  	25.06.2018
Bodo/Glimt - Sandefjord	1:1	1.43	  4.51  	6.84	24.06.2018
Haugesund - Lillestrom	2:2	2.02	  3.50  	3.53	24.06.2018
Rosenborg - Valerenga	3:0	  1.60  	3.94	5.34	24.06.2018
Sarpsborg 08 - Tromso	2:3	1.72	3.75	  4.56  	24.06.2018
Start - Kristiansund	2:0	  2.47  	3.23	2.86	24.06.2018
Stromsgodset - Ranheim	3:0	  1.53  	4.32	5.59	24.06.2018
Molde - Stabaek	3:0	  1.66  	4.06	4.59	23.06.2018
13. ROUND	1	X	2	 
Tromso - Rosenborg	2:1	  3.61  	3.39	2.03	11.06.2018
Brann - Valerenga	0:0	1.81	  3.45  	4.49	10.06.2018
Lillestrom - Odd	0:0	2.02	  3.47  	3.56	10.06.2018
Ranheim - Sarpsborg 08	2:1	  3.01  	3.38	2.30	10.06.2018
Sandefjord - Haugesund	0:2	3.55	3.24	  2.10  	10.06.2018
Stabaek - Bodo/Glimt	0:0	2.09	  3.67  	3.20	10.06.2018
Start - Stromsgodset	1:1	3.80	  3.65  	1.90	10.06.2018
Kristiansund - Molde	1:0	  2.79  	3.37	2.45	09.06.2018
12. ROUND	1	X	2	 
Sarpsborg 08 - Stabaek	4:2	  1.74  	3.77	4.46	28.05.2018
Bodo/Glimt - Ranheim	4:0	  1.67  	3.96	4.69	27.05.2018
Haugesund - Tromso	1:0	  1.76  	3.69	4.49	27.05.2018
Molde - Start	3:1	  1.44  	4.57	6.57	27.05.2018
Odd - Kristiansund	1:2	1.98	3.38	  3.80  	27.05.2018
Rosenborg - Brann	1:2	1.69	3.56	  5.18  	27.05.2018
Stromsgodset - Sandefjord	2:0	  1.33  	5.02	8.71	27.05.2018
Valerenga - Lillestrom	1:0	  1.99  	3.58	3.54	26.05.2018
11. ROUND	1	X	2	 
Haugesund - Rosenborg	1:2	3.35	3.23	  2.20  	21.05.2018
Kristiansund - Stromsgodset	4:0	  2.93  	3.28	2.39	21.05.2018
Lillestrom - Brann	1:1	2.96	  3.28  	2.37	21.05.2018
Ranheim - Molde	3:1	  3.18  	3.50	2.15	21.05.2018
Sandefjord - Sarpsborg 08	0:1	4.27	3.41	  1.86  	21.05.2018
Stabaek - Odd	2:1	  2.43  	3.37	2.81	21.05.2018
Start - Bodo/Glimt	1:0	  2.78  	3.42	2.42	21.05.2018
Tromso - Valerenga	3:0	  2.29  	3.50	2.92	21.05.2018
10. ROUND	1	X	2	 
Bodo/Glimt - Tromso	0:1	1.82	3.79	  3.96  	16.05.2018
Brann - Haugesund	1:1	1.76	  3.50  	4.72	16.05.2018
Kristiansund - Ranheim	1:3	2.29	3.28	  3.09  	16.05.2018
Molde - Stromsgodset	2:0	  2.07  	3.52	3.36	16.05.2018
Odd - Sandefjord	5:0	  1.55  	3.83	6.26	16.05.2018
Rosenborg - Lillestrom	3:0	  1.41  	4.47	7.39	16.05.2018
Sarpsborg 08 - Start	4:0	  1.53  	4.05	6.04	16.05.2018
Valerenga - Stabaek	1:0	  1.62  	4.16	4.84	16.05.2018
9. ROUND	1	X	2	 
Haugesund - Kristiansund	3:2	  1.79  	3.47	4.64	13.05.2018
Molde - Bodo/Glimt	1:2	1.72	3.82	  4.50  	13.05.2018
Ranheim - Odd	3:1	  2.51  	3.29	2.75	13.05.2018
Stabaek - Rosenborg	0:1	4.42	3.77	  1.75  	13.05.2018
Stromsgodset - Sarpsborg 08	1:2	2.01	3.36	  3.73  	13.05.2018
Tromso - Lillestrom	1:2	2.12	3.39	  3.38  	13.05.2018
Sandefjord - Valerenga	0:1	4.00	3.50	  1.89  	12.05.2018
Start - Brann	0:1	3.64	3.45	  2.00  	12.05.2018
8. ROUND	1	X	2	 
Sarpsborg 08 - Molde	2:2	2.27	  3.34  	3.08	07.05.2018
Bodo/Glimt - Stromsgodset	2:2	2.23	  3.48  	3.03	06.05.2018
Brann - Tromso	3:0	  1.65  	3.71	5.24	06.05.2018
Kristiansund - Stabaek	1:0	  2.14  	3.43	3.24	06.05.2018
Lillestrom - Sandefjord	1:0	  1.40  	4.63	7.30	06.05.2018
Odd - Start	3:0	  1.80  	3.48	4.47	06.05.2018
Valerenga - Haugesund	2:2	1.90	  3.56  	3.90	06.05.2018
Rosenborg - Ranheim	1:1	1.28	  5.49  	10.15	05.05.2018
7. ROUND	1	X	2	 
Stabaek - Lillestrom	3:2	  2.37  	3.44	2.84	30.04.2018
Molde - Odd	0:1	1.65	3.81	  5.13  	29.04.2018
Sandefjord - Brann	0:1	4.49	3.39	  1.83  	29.04.2018
Sarpsborg 08 - Bodo/Glimt	0:0	1.82	  3.64  	4.19	29.04.2018
Start - Haugesund	0:1	2.64	3.29	  2.61  	29.04.2018
Stromsgodset - Rosenborg	0:1	3.15	3.35	  2.23  	29.04.2018
Tromso - Kristiansund	0:0	1.63	  3.84  	5.24	29.04.2018
Ranheim - Valerenga	2:2	3.25	  3.45  	2.15	28.04.2018
2. ROUND	1	X	2	 
Stabaek - Start	1:1	1.68	  3.97  	4.59	25.04.2018
1. ROUND	1	X	2	 
Ranheim - Brann	0:2	3.08	3.29	  2.30  	25.04.2018
6. ROUND	1	X	2	 
Odd - Sarpsborg 08	3:1	  2.66  	3.16	2.69	23.04.2018
Haugesund - Stromsgodset	1:0	  2.36  	3.33	2.93	22.04.2018
Kristiansund - Bodo/Glimt	1:1	2.37	  3.30  	2.94	22.04.2018
Lillestrom - Ranheim	0:1	1.54	4.17	  5.64  	22.04.2018
Rosenborg - Start	2:0	  1.26  	5.84	9.87	22.04.2018
Tromso - Sandefjord	4:1	  1.43  	4.41	7.10	22.04.2018
Valerenga - Molde	0:0	2.00	  3.51  	3.58	22.04.2018
Brann - Stabaek	3:0	  1.71  	3.67	4.77	21.04.2018
5. ROUND	1	X	2	 
Bodo/Glimt - Rosenborg	0:1	4.67	3.82	  1.70  	16.04.2018
Molde - Lillestrom	2:1	  1.66  	3.88	4.91	15.04.2018
Ranheim - Haugesund	4:2	  2.79  	3.32	2.46	15.04.2018
Sandefjord - Kristiansund	3:3	2.61	  3.12  	2.77	15.04.2018
Sarpsborg 08 - Brann	1:2	2.20	3.27	  3.32  	15.04.2018
Stabaek - Tromso	1:1	2.07	  3.53  	3.35	15.04.2018
Stromsgodset - Odd	3:0	  1.85  	3.56	4.12	15.04.2018
Start - Valerenga	1:6	2.56	3.38	  2.64  	14.04.2018
2. ROUND	1	X	2	 
Sandefjord - Ranheim	1:2	1.93	3.45	  3.92  	11.04.2018
Tromso - Stromsgodset	3:1	  2.31  	3.40	2.95	11.04.2018
4. ROUND	1	X	2	 
Lillestrom - Start	1:0	  1.90  	3.57	3.91	09.04.2018
Brann - Kristiansund	1:0	  1.64  	3.76	5.37	08.04.2018
Haugesund - Sarpsborg 08	1:1	2.72	  3.20  	2.60	08.04.2018
Odd - Bodo/Glimt	1:0	  2.08  	3.46	3.41	08.04.2018
Rosenborg - Molde	4:0	  1.79  	3.60	4.36	08.04.2018
Sandefjord - Stabaek	1:1	2.72	  3.44  	2.47	08.04.2018
Tromso - Ranheim	4:0	  1.63  	3.94	5.03	08.04.2018
Valerenga - Stromsgodset	1:4	2.01	3.55	  3.53  	07.04.2018
3. ROUND	1	X	2	 
Bodo/Glimt - Haugesund	0:3	1.84	3.61	  4.12  	02.04.2018
Kristiansund - Lillestrom	2:1	  2.71  	3.23	2.59	02.04.2018
Molde - Tromso	2:1	  1.52  	4.16	6.08	02.04.2018
Odd - Rosenborg	1:1	3.46	  3.32  	2.11	02.04.2018
Ranheim - Stabaek	4:1	  3.08  	3.47	2.21	02.04.2018
Sarpsborg 08 - Valerenga	3:0	  2.09  	3.38	3.46	02.04.2018
Start - Sandefjord	1:4	1.63	3.81	  5.30  	02.04.2018
Stromsgodset - Brann	1:1	2.00	  3.48  	3.61	02.04.2018
2. ROUND	1	X	2	 
Brann - Bodo/Glimt	2:0	  1.81  	3.53	4.35	18.03.2018
Haugesund - Molde	0:1	2.98	3.23	  2.38  	18.03.2018
Valerenga - Odd	2:1	  1.94  	3.41	3.92	18.03.2018
Lillestrom - Sarpsborg 08	2:2	2.58	  3.22  	2.73	17.03.2018
Rosenborg - Kristiansund	2:2	1.23	  5.90  	13.05	17.03.2018
1. ROUND	1	X	2	 
Kristiansund - Valerenga	0:1	2.62	3.29	  2.66  	12.03.2018
Bodo/Glimt - Lillestrom	3:1	  2.28  	3.38	3.05	11.03.2018
Molde - Sandefjord	5:0	  1.41  	4.55	7.35	11.03.2018
Odd - Haugesund	1:2	1.85	3.36	  4.45  	11.03.2018
Sarpsborg 08 - Rosenborg	1:0	  3.07  	3.21	2.34	11.03.2018
Start - Tromso	4:1	  2.36  	3.24	3.02	11.03.2018
Stromsgodset - Stabaek	2:2	1.67	  3.84  	4.96	11.03.2018`, Validators.required),
    });
   }

  ngOnInit() {
  }

  reset() {
    this.form.reset();
    this.jsonStr = '';
    this.copyDone = '';
  }

  convert() {
    this.copyDone = '';
    let raw = this.form.get('raw').value;
    const excludeRoundRegexp = /\d+.*ROUND.*2/gm;
    raw = raw.replace(excludeRoundRegexp, '');
    const extractRegexp = /(.*)\s-\s(.*)\s+(\d+:\d+)/gm;
    const extractedData = raw.match(extractRegexp);
    if (!!extractedData) {
      let matchesObjs: MatchResult[] = extractedData.map(str => {
        const obj = new MatchResult(str);
        return obj;
      });
      matchesObjs.reverse();
      
      matchesObjs = matchesObjs.map((match, index) => {
        match.homeTotal = this.buildTotal(matchesObjs.slice(0, index), match.home);
        match.homeIn = this.buildHomeIn(matchesObjs.slice(0, index), match.home);
        match.visitorTotal = this.buildTotal(matchesObjs.slice(0, index), match.visitor);
        match.visitorOut = this.buildVisitorOut(matchesObjs.slice(0, index), match.visitor);
        return match;
      });

      matchesObjs = this.filterSmallTotalMatches(matchesObjs);
      console.table(matchesObjs);
      this.jsonStr = JSON.stringify(matchesObjs);
      this.copyToClipboard(this.jsonStr);
    } else {
      this.jsonStr = 'Parse error';
    }
  }

  private copyToClipboard(source: string) {
    if ((navigator as NavigatorExtended).clipboard) {
      (navigator as NavigatorExtended).clipboard.writeText(source)
        .then(() => this.copyDone = 'Copy to clipboard done')
        .catch(err => console.log('Copy to clipboard failed', err));
    }
  }

  buildTotal(list: MatchResult[], team: string): string {
    let wins = 0;
    let equals = 0;
    let loses = 0;
    let ballsShots = 0;
    let ballsLoses = 0;

    list.forEach(match => {
      if (match.home === team) {
        switch (match.result) {
          case Result.Win: wins += 1;
            break;
          case Result.Equal: equals += 1;
            break;
          case Result.Lose: loses += 1;
            break;
        }

        ballsShots += match.ballsHome;
        ballsLoses += match.ballsVisitor;
      }

      if (match.visitor === team) {
        switch (match.result) {
          case Result.Win: loses += 1;
            break;
          case Result.Equal: equals += 1;
            break;
          case Result.Lose: wins += 1;
            break;
        }

        ballsShots += match.ballsVisitor;
        ballsLoses += match.ballsHome;
      }
    });
    return `${wins} ${equals} ${loses} ${ballsShots}:${ballsLoses}`;
  }

  buildHomeIn(list: MatchResult[], team: string): string {
    let wins = 0;
    let equals = 0;
    let loses = 0;
    let ballsShots = 0;
    let ballsLoses = 0;

    list.forEach(match => {
      if (match.home === team) {
        switch (match.result) {
          case Result.Win: wins += 1;
            break;
          case Result.Equal: equals += 1;
            break;
          case Result.Lose: loses += 1;
            break;
        }

        ballsShots += match.ballsHome;
        ballsLoses += match.ballsVisitor;
      }
    });
    return `${wins} ${equals} ${loses} ${ballsShots}:${ballsLoses}`;
  }

  buildVisitorOut(list: MatchResult[], team: string): string {
    let wins = 0;
    let equals = 0;
    let loses = 0;
    let ballsShots = 0;
    let ballsLoses = 0;

    list.forEach(match => {
      if (match.visitor === team) {
        switch (match.result) {
          case Result.Win: loses += 1;
            break;
          case Result.Equal: equals += 1;
            break;
          case Result.Lose: wins += 1;
            break;
        }

        ballsShots += match.ballsVisitor;
        ballsLoses += match.ballsHome;
      }
    });
    return `${wins} ${equals} ${loses} ${ballsShots}:${ballsLoses}`;
  }

  filterSmallTotalMatches(matches: MatchResult[]): MatchResult[] {
    const regExp = new RegExp(/\d+/g);
    
    return matches.filter(match => {
      const homeTotalMatchesCountArr = match.homeTotal.match(regExp);
      const homeTotalMatchesCount = parseInt(homeTotalMatchesCountArr[0], 10) + 
        parseInt(homeTotalMatchesCountArr[1], 10) + 
        parseInt(homeTotalMatchesCountArr[2], 10);
      const visitorTotalMatchesCountArr = match.visitorTotal.match(regExp);
      const visitorTotalMatchesCount = parseInt(visitorTotalMatchesCountArr[0], 10) + 
        parseInt(visitorTotalMatchesCountArr[1], 10) + 
        parseInt(visitorTotalMatchesCountArr[2], 10);
      return homeTotalMatchesCount > 5 && visitorTotalMatchesCount > 5;
    })
  }

}

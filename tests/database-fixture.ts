import { initialPortfolioData } from "../src/data/portfolioData";
console.log(
  `create schema test; create table test.fixture(content jsonb); insert into test.fixture values ('${JSON.stringify(initialPortfolioData).replaceAll("'", "''")}'); grant usage on schema test to anon,authenticated; grant select on test.fixture to anon,authenticated;`,
);

GetCountries
============

This is my fork of the peric/GetCountries repository. The additional feature is YAML data generation. 

<i>YAML data generation added; According to YAML guidelines, each space is not a TAB character, but a group of two spaces. Thus, space formatting is implemented here.</i>

All data is fetched from geonames.org

<h2>Example</h2>
Here is a screenshot of the newly added feature, having selected only <b>countryCode</b> and <b>countryName</b> columns:

<p align="center">
  <img  src="_img/YAML_feature.PNG" alt="YAML feature" />
</p>

To check if everything's fine, according to YAML's strict syntax, <a href="http://www.yamllint.com/>YAML Lint</a> is a good solution:

<p align="center">
  <img  src="_img/valid_YAML.PNG" alt="YAML feature" />
</p>

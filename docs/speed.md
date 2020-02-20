# StormDB Speed

StormDB features some blazingly fast read and write speeds. All benchmarks done on the same i5 CPU. All table figures rounded to 2 D.P.

The write test measures the time to create the attributes and save them to the database. [Code for Write Benchmarks](../benchmarks/writeBenchmark.js)

| No. of Attributes Written | Time Elapsed | Attributes Wrote/sec | Data Size Wrote |
|--------------------------:|-------------:|---------------------:|----------------:|
|                   100,000 |         54ms |     1,851,851.85/sec |         1.32 mb |
|                 1,000,000 |        487ms |     2,053,388.09/sec |         14.20mb |
|                10,000,000 |     13,312ms |       751,201.92/sec |        151.53mb |

The read test measures how the time it takes to read the attributes from the database. [Code for Read Benchmarks](../benchmarks/readBenchmark.js)

| No. of Attributes Read | Time Elapsed | Attributes Read/sec | Data Size Read |
|-----------------------:|-------------:|--------------------:|---------------:|
|                100,000 |         15ms |    6,666,666.67/sec |         1.32mb |
|              1,000,000 |        161ms |    6,211,180.12/sec |        14.20mb |
|             10,000,000 |      1,499ms |    6,671,114.08/sec |       151.53mb |

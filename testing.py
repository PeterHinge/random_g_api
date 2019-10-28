import pandas as pd
import ndjson

with open('googleData/full_raw_The Eiffel Tower.ndjson') as f:
    data = ndjson.load(f)

df = pd.DataFrame(data)

df.head()

import pandas as pd
import sys

def parse_excel():
    try:
        file_path = 'docs/alliance-report/UPDATED TMS GUIDELINES 2025-02-06 2.xlsx'
        xls = pd.ExcelFile(file_path)
        print("Sheets:", xls.sheet_names)
        
        for sheet in xls.sheet_names:
            print(f"\n--- Sheet: {sheet} ---")
            df = pd.read_excel(file_path, sheet_name=sheet)
            # Find rows with formulas
            for idx, row in df.iterrows():
                row_str = ' | '.join(str(val) for val in row.values if pd.notna(val))
                if 'gross' in row_str.lower() or 'tax' in row_str.lower() or 'subtotal' in row_str.lower() or 'vat' in row_str.lower():
                    print(row_str)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    parse_excel()

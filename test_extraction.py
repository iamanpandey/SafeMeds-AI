import unittest

from backend.main import extract_fields


class ExtractionTests(unittest.TestCase):
    def test_extracts_common_label_fields(self):
        text = """Paracetamol Tablets IP
500 mg
Batch No: A1234
Mfg. Date: 01/2024
Expiry Date: 01/2027
Take after food"""
        fields = extract_fields(text)
        self.assertEqual(fields.medicine_name, "Paracetamol Tablets IP")
        self.assertEqual(fields.strength, "500 mg")
        self.assertEqual(fields.batch_number, "A1234")
        self.assertEqual(fields.manufacturing_date, "01/2024")
        self.assertEqual(fields.expiry_date, "01/2027")
        self.assertEqual(fields.printed_instructions, "Take after food")

    def test_missing_fields_remain_none(self):
        fields = extract_fields("A blurry label with no clear medicine details")
        self.assertIsNone(fields.expiry_date)
        self.assertIsNone(fields.batch_number)


if __name__ == "__main__":
    unittest.main()

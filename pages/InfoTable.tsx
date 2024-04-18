import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function InfoTable({ data }: { data: any }) {
  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Interaction Severity Level</TableCell>
          <TableCell align="right">Medicine 1</TableCell>
          <TableCell align="right">Medicine 2</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {/* {rows.map((row) => (
          <TableRow
            key={row.name}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="right">{row.calories}</TableCell>
            <TableCell align="right">{row.fat}</TableCell>
          </TableRow>
        ))} */}
      </TableBody>
    </Table>
  );
}

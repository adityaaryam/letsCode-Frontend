import React, { useEffect, useState } from "react";
import './AllSubmissions.css'
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';



function createData(submissionId, language,code, custIn, toDis) {
    return { submissionId,language , code , custIn, toDis};
}
function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
  
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.submissionId}
          </TableCell>
          <TableCell align="right">{row.language}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Code
                </Typography>
                <textarea
                    rows="5"
                    columns="5"
                    value={row.code}
                    className="customInput1"
                    disabled
                />
                <Typography variant="h6" gutterBottom component="div">
                  Custom Input
                </Typography>
                <textarea
                    rows="2"
                    columns="5"
                    value={row.custIn}
                    className="customInput2"
                    disabled
                />
                <Typography variant="h6" gutterBottom component="div">
                  Output
                </Typography>
                <textarea
                    rows="5"
                    columns="5"
                    value={row.toDis}
                    className="customInput2"
                    disabled
                />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  
  Row.propTypes = {
    row: PropTypes.shape({
      language: PropTypes.string.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          code: PropTypes.string.isRequired,
          custIn: PropTypes.string.isRequired,
          toDis: PropTypes.string.isRequired,
        }),
      ).isRequired,
      submissionId: PropTypes.string.isRequired,
    }).isRequired,
  };
  
function MyRow({dataArr}){
    var rows=[];
    for(var idx=dataArr.length-1;idx>=0;idx--)
    {
        rows.push(createData(dataArr[idx]._id,dataArr[idx].language, dataArr[idx].code, dataArr[idx].custIn, dataArr[idx].toDis));
    }
    return( 
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Submission ID</TableCell>
            <TableCell align="right">Language</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
}   
export default MyRow
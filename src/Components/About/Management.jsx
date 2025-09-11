import React from "react";
import PageLayout from "../Layout/PageLayout";

const rows = [
  { name: "S. Anitha", desig: "Chairperson" },
  { name: "R. Mohan", desig: "Vice Chairperson" },
  { name: "L. Nidhi", desig: "Secretary" },
  { name: "V. Sanjay", desig: "Treasurer" },
  { name: "P. Keerthi", desig: "Member" },
  { name: "A. Ramesh", desig: "Member" },
  { name: "K. Teja", desig: "Member" },
  { name: "G. Swathi", desig: "Member" },
  { name: "T. Mahesh", desig: "Member" },
  { name: "N. Kavitha", desig: "Member" },
];

export default function Management() {
  return (
    <PageLayout
      title="Management Committee"
      quote="Guiding the school with dedication and vision."
      description="Our committee consists of passionate educators and leaders committed to student success."
    >
      <div className="table-wrap" style={{overflowX:'auto', marginTop:12}}>
        <table className="committee" style={{width:'100%', borderCollapse:'collapse', border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden'}}>
          <thead style={{background:'#f8fafc'}}>
            <tr>
              <th style={{padding:'10px 12px', textAlign:'left'}}>Name</th>
              <th style={{padding:'10px 12px', textAlign:'left'}}>Designation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{borderBottom:'1px solid #e5e7eb'}}>
                <td style={{padding:'10px 12px'}}>{r.name}</td>
                <td style={{padding:'10px 12px'}}>{r.desig}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
}

import React from 'react'
import PageLayout from "../Layout/PageLayout"

function History() {
  return (
    <PageLayout
      title="Our History"
      quote="Rooted in service, growing with excellence."
      description="Established to serve the community, ZPHS has grown into a beacon of inclusive and quality education."
    >
      <div style={{display:'grid', gap:12}}>
        <p>
          Since its establishment, ZPHS has nurtured generations of learners, adapting to changing times while upholding core values of integrity, diligence, and compassion.
        </p>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12}}>
          <div style={{border:'1px solid #e5e7eb', borderRadius:12, padding:12}}>
            <strong>2002</strong>
            <p style={{margin: '6px 0 0'}}>School inaugurated with a mission to provide education for all.</p>
          </div>
          <div style={{border:'1px solid #e5e7eb', borderRadius:12, padding:12}}>
            <strong>2012</strong>
            <p style={{margin: '6px 0 0'}}>New science labs and library facilities added.</p>
          </div>
          <div style={{border:'1px solid #e5e7eb', borderRadius:12, padding:12}}>
            <strong>2022</strong>
            <p style={{margin: '6px 0 0'}}>Digital classrooms and STEM initiatives launched.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default History
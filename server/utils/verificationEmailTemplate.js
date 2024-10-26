const verificationEmailTemplate = (
  link,
  name
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
 <meta charset="UTF-8" />
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <!--[if !mso]><!-- -->
 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 <!--<![endif]-->
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <meta name="format-detection" content="telephone=no" />
 <meta name="format-detection" content="date=no" />
 <meta name="format-detection" content="address=no" />
 <meta name="format-detection" content="email=no" />
 <meta name="x-apple-disable-message-reformatting" />
 <link href="https://fonts.googleapis.com/css?family=Hanken+Grotesk:ital,wght@0,400;0,600;0,700" rel="stylesheet" />
 
 <!-- Made with Postcards by Designmodo https://designmodo.com/postcards -->
 <style>
 html,
         body {
             margin: 0 !important;
             padding: 0 !important;
             min-height: 100% !important;
             width: 100% !important;
             -webkit-font-smoothing: antialiased;
         }
 
         * {
             -ms-text-size-adjust: 100%;
         }
 
         #outlook a {
             padding: 0;
         }
 
         .ReadMsgBody,
         .ExternalClass {
             width: 100%;
         }
 
         .ExternalClass,
         .ExternalClass p,
         .ExternalClass td,
         .ExternalClass div,
         .ExternalClass span,
         .ExternalClass font {
             line-height: 100%;
         }
 
         table,
         td,
         th {
             mso-table-lspace: 0 !important;
             mso-table-rspace: 0 !important;
             border-collapse: collapse;
         }
 
         u + .body table, u + .body td, u + .body th {
             will-change: transform;
         }
 
         body, td, th, p, div, li, a, span {
             -webkit-text-size-adjust: 100%;
             -ms-text-size-adjust: 100%;
             mso-line-height-rule: exactly;
         }
 
         img {
             border: 0;
             outline: 0;
             line-height: 100%;
             text-decoration: none;
             -ms-interpolation-mode: bicubic;
         }
 
         a[x-apple-data-detectors] {
             color: inherit !important;
             text-decoration: none !important;
         }
 
         .pc-gmail-fix {
             display: none;
             display: none !important;
         }
 
         .body .pc-project-body {
             background-color: transparent !important;
         }
 
         @media (min-width: 621px) {
             .pc-lg-hide {
                 display: none;
             } 
 
             .pc-lg-bg-img-hide {
                 background-image: none !important;
             }
         }
 </style>
 <style>
 @media (max-width: 620px) {
 .pc-project-body {min-width: 0px !important;}
 .pc-project-container {width: 100% !important;}
 .pc-sm-hide {display: none !important;}
 .pc-sm-bg-img-hide {background-image: none !important;}
 .pc-w620-fontSize-30 {font-size: 30px !important;}
 .pc-w620-lineHeight-40 {line-height: 40px !important;}
 table.pc-w620-spacing-0-0-12-0 {margin: 0px 0px 12px 0px !important;}
 td.pc-w620-spacing-0-0-12-0,th.pc-w620-spacing-0-0-12-0{margin: 0 !important;padding: 0px 0px 12px 0px !important;}
 .pc-w620-padding-0-0-0-0 {padding: 0px 0px 0px 0px !important;}
 .pc-w620-fontSize-15px {font-size: 15px !important;}
 .pc-w620-lineHeight-140pc {line-height: 140% !important;}
 table.pc-w620-spacing-0-0-24-0 {margin: 0px 0px 24px 0px !important;}
 td.pc-w620-spacing-0-0-24-0,th.pc-w620-spacing-0-0-24-0{margin: 0 !important;padding: 0px 0px 24px 0px !important;}
 .pc-w620-fontSize-17px {font-size: 17px !important;}
 table.pc-w620-spacing-0-0-0-0 {margin: 0px 0px 0px 0px !important;}
 td.pc-w620-spacing-0-0-0-0,th.pc-w620-spacing-0-0-0-0{margin: 0 !important;padding: 0px 0px 0px 0px !important;}
 .pc-w620-padding-12-20-12-20 {padding: 12px 20px 12px 20px !important;}
 .pc-w620-width-100pc {width: 100% !important;}
 .pc-w620-height-auto {height: auto !important;}
 .pc-w620-padding-30-28-30-28 {padding: 30px 28px 30px 28px !important;}
 
 .pc-w620-gridCollapsed-1 > tbody,.pc-w620-gridCollapsed-1 > tbody > tr,.pc-w620-gridCollapsed-1 > tr {display: inline-block !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > tr > td,.pc-w620-gridCollapsed-1 > tr > td {display: block !important;width: auto !important;padding-left: 0 !important;padding-right: 0 !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-first > .pc-grid-td-first,pc-w620-gridCollapsed-1 > .pc-grid-tr-first > .pc-grid-td-first {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-last > .pc-grid-td-last,pc-w620-gridCollapsed-1 > .pc-grid-tr-last > .pc-grid-td-last {padding-bottom: 0 !important;}
 
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-first > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-first > td {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-last > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-last > td {padding-bottom: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-first,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-first {padding-left: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-last,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-last {padding-right: 0 !important;}
 
 .pc-w620-tableCollapsed-1 > tbody,.pc-w620-tableCollapsed-1 > tbody > tr,.pc-w620-tableCollapsed-1 > tr {display: block !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1 > tbody > tr > td,.pc-w620-tableCollapsed-1 > tr > td {display: block !important;width: auto !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
 }
 </style>
 <!--[if !mso]><!-- -->
 <style>
 @media all { @font-face { font-family: 'Hanken Grotesk'; font-style: normal; font-weight: 700; src: url('https://fonts.gstatic.com/s/hankengrotesk/v8/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_NcVGFq6PBK.woff') format('woff'), url('https://fonts.gstatic.com/s/hankengrotesk/v8/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_NcVGFq6PBM.woff2') format('woff2'); } @font-face { font-family: 'Hanken Grotesk'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/hankengrotesk/v8/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_Ncs2Zq6PBK.woff') format('woff'), url('https://fonts.gstatic.com/s/hankengrotesk/v8/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_Ncs2Zq6PBM.woff2') format('woff2'); } @font-face { font-family: 'Hanken Grotesk'; font-style: normal; font-weight: 600; src: url('https://fonts.gstatic.com/s/hankengrotesk/v8/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_NcbWFq6PBK.woff') format('woff'), url('https://fonts.gstatic.com/s/hankengrotesk/v8/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_NcbWFq6PBM.woff2') format('woff2'); } }
 </style>
 <!--<![endif]-->
 <!--[if mso]>
    <style type="text/css">
        .pc-font-alt {
            font-family: Arial, Helvetica, sans-serif !important;
        }
    </style>
    <![endif]-->
 <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
</head>

<body class="body pc-font-alt" style="width: 100% !important; min-height: 100% !important; margin: 0 !important; padding: 0 !important; line-height: 1.5; color: #2D3A41; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-variant-ligatures: normal; text-rendering: optimizeLegibility; -moz-osx-font-smoothing: grayscale; background-color: #f3e5ff;" bgcolor="#f3e5ff">
 <table class="pc-project-body" style="table-layout: fixed; min-width: 600px; background-color: #f3e5ff;" bgcolor="#f3e5ff" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
  <tr>
   <td align="center" valign="top">
    <table class="pc-project-container" align="center" width="600" style="width: 600px; max-width: 600px;" border="0" cellpadding="0" cellspacing="0" role="presentation">
     <tr>
      <td style="padding: 20px 0px 20px 0px;" align="left" valign="top">
       <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width: 100%;">
        <tr>
         <td valign="top">
          <!-- BEGIN MODULE: Header -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td class="pc-w620-spacing-0-0-0-0" style="padding: 0px 0px 0px 0px;">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w620-padding-30-28-30-28" style="padding: 40px 40px 40px 40px; border-radius: 2px 2px 0px 0px; background-color: #53335d;" bgcolor="#53335d">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td class="pc-w620-spacing-0-0-12-0" align="center" valign="top" style="padding: 0px 0px 16px 0px;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="0" align="center" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                    <tr>
                     <td valign="top" class="pc-w620-padding-0-0-0-0" align="center" style="padding: 0px 40px 0px 40px;">
                      <div class="pc-font-alt pc-w620-fontSize-30 pc-w620-lineHeight-40" style="line-height: 90%; letter-spacing: -0.03em; font-family: 'Hanken Grotesk', Arial, Helvetica, sans-serif; font-size: 52px; font-weight: bold; font-variant-ligatures: normal; color: #f5c04d; text-align: center; text-align-last: center;">
                       <div><span>Hello, ${name}</span>
                       </div>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td class="pc-w620-spacing-0-0-24-0" align="center" valign="top" style="padding: 0px 0px 28px 0px;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                    <tr>
                     <td valign="top" class="pc-w620-padding-0-0-0-0" align="center" style="padding: 0px 0px 0px 0px;">
                      <div class="pc-font-alt pc-w620-fontSize-15px pc-w620-lineHeight-140pc" style="line-height: 160%; letter-spacing: -0.6px; font-family: 'Hanken Grotesk', Arial, Helvetica, sans-serif; font-size: 18px; font-weight: normal; font-variant-ligatures: normal; color: #ffffffcc; text-align: center; text-align-last: center;">
                       <div><span>Click the button bellow to confirm your email</span>
                       </div>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <th valign="top" class="pc-w620-spacing-0-0-0-0" align="center" style="padding: 0px 0px 0px 0px; text-align: center; font-weight: normal; line-height: 1;">
                   <!--[if mso]>
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-width-100pc" align="center" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
            <tr>
                <td valign="middle" align="center" style="border-radius: 134px 134px 134px 134px; background-color: #f5c04e; text-align:center; color: #ffffff; padding: 16px 32px 16px 32px; mso-padding-left-alt: 0; margin-left:32px;" bgcolor="#f5c04e">
                                    <a class="pc-font-alt" style="display: inline-block; text-decoration: none; font-variant-ligatures: normal; font-family: 'Hanken Grotesk', Arial, Helvetica, sans-serif; font-weight: 600; font-size: 18px; line-height: 150%; letter-spacing: -0.2px; text-align: center; color: #27142d;" href="${link}" target="_blank"><span style="display: block;"><span>Verify Email</span></span></a>
                                </td>
            </tr>
        </table>
        <![endif]-->
                   <!--[if !mso]><!-- -->
                   <a class="pc-w620-width-100pc pc-w620-fontSize-17px" style="display: inline-block; box-sizing: border-box; border-radius: 134px 134px 134px 134px; background-color: #f5c04e; padding: 16px 32px 16px 32px; font-family: 'Hanken Grotesk', Arial, Helvetica, sans-serif; font-weight: 600; font-size: 18px; line-height: 150%; letter-spacing: -0.2px; color: #27142d; vertical-align: top; text-align: center; text-align-last: center; text-decoration: none; -webkit-text-size-adjust: none;" href="${link}" target="_blank"><span style="display: block;"><span>Verify Email</span></span></a>
                   <!--<![endif]-->
                  </th>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
          <!-- END MODULE: Header -->
         </td>
        </tr>
       </table>
      </td>
     </tr>
    </table>
   </td>
  </tr>
 </table>
 <!-- Fix for Gmail on iOS -->
 <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
 </div>
</body>

</html>
`;

module.exports = verificationEmailTemplate;

<%@ Page Language="C#" %>

<%@ Import Namespace="System.IO" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script runat="server">
        protected void UploadButton_Click(object sender, EventArgs e)
        {
            if(txtPassword.Text != "12345Abcde")
            {
                StatusLabel.Text = "Bad password!";
                return;
            }
            if (FileUploadControl.HasFile)
            {
                try
                {
                    if (FileUploadControl.PostedFile.ContentType == "text/plain")
                    {
                        if (FileUploadControl.PostedFile.ContentLength < 102400)
                        {
                            string filename = Path.GetFileName(FileUploadControl.FileName);
                            filename = Server.MapPath("~/") + filename;
                            if (File.Exists(filename) && !chkOverwrite.Checked){
                                StatusLabel.Text = "File already uploaded!";
                                return;
                            }
                            FileUploadControl.SaveAs(filename);
                            StatusLabel.Text = "Upload status: File uploaded!";
                        }
                        else
                            StatusLabel.Text = "Upload status: The file has to be less than 100 kb!";
                    }
                    else
                        StatusLabel.Text = "Upload status: Only JPEG files are accepted!";
                }
                catch (Exception ex)
                {
                    StatusLabel.Text = "Upload status: The file could not be uploaded. The following error occured: " + ex.Message;
                }
            }
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        Password:
        <asp:TextBox ID="txtPassword" runat="server" TextMode="Password"></asp:TextBox>
        <br />
        <br />
        <asp:FileUpload ID="FileUploadControl" runat="server" />
        <asp:Button runat="server" ID="UploadButton" Text="Upload" OnClick="UploadButton_Click" />
        <asp:CheckBox ID="chkOverwrite" runat="server" Checked="True" Text="Overwrite file if exists" />
        <hr />
        <asp:Label runat="server" ID="StatusLabel" Text="Upload status: " />
    </form>
</body>
</html>

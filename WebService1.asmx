<%@ WebService Language="C#" Class="WebService1" %>
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data.SqlClient;

[WebService(Namespace = "http://qa.com/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
[System.ComponentModel.ToolboxItem(false)]
[System.Web.Script.Services.ScriptService]
public class WebService1 : System.Web.Services.WebService
{

    [WebMethod]
    public string getInfo()
    {
        return "Hello ";
    }
    [WebMethod]
    public void setInfo(string name, string email)
    {
        SqlConnection con = new SqlConnection(@"workstation id=QAIntroduction.mssql.somee.com;packet size=4096;user id=mikesmith_SQLLogin_1;pwd=77l5ggen6w;data source=QAIntroduction.mssql.somee.com;persist security info=False;initial catalog=QAIntroduction");
        var sql = string.Format("INSERT INTO emails (name, email) VALUES ('{0}', '{1}')", name, email);
        SqlCommand com = new SqlCommand(sql, con);
        con.Open();
        com.ExecuteNonQuery();
        con.Close();
    }

    [WebMethod]
    public string getExam(string examName, string userName, string password)
    {
        // if username and password is recorded for the examName
        string test = null;
        try{
            test = System.IO.File.ReadAllText(Server.MapPath("../"+examName));
        }catch(Exception ex){ return ex.Message;}
        return test;
    }

    [WebMethod]
    private void saveResults(string testName, string userName, int maxPoints, int grade, string results)
    {
        //TABLE: testResuts:
        //  testName	    varchar	30
        //  userName	    varchar	30
        //  dateSubmitted	getdate()
        //  maxPoints	    int
        //  grade		    int
        //  results		    varchar	200

        SqlConnection con = new SqlConnection(@"workstation id=QAIntroduction.mssql.somee.com;packet size=4096;user id=mikesmith_SQLLogin_1;pwd=77l5ggen6w;data source=QAIntroduction.mssql.somee.com;persist security info=False;initial catalog=QAIntroduction");
        var sql = string.Format("INSERT INTO testResuts (testName, userName, maxPoints, grade, results) VALUES ('{0}', '{1}',{2},{3},'{4}')",
                    testName, userName, maxPoints, grade, results);
        SqlCommand com = new SqlCommand(sql, con);
        con.Open();
        com.ExecuteNonQuery();
        con.Close();
    }
}

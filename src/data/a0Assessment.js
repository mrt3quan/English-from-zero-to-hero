export const a0Assessment={
  id:'a0-final-v1',
  level:'A0',
  label:'A0 · Starter / Pre-A1',
  titleVi:'Kiểm tra cuối A0',
  introVi:'Bài kiểm tra xem bạn có thực sự hiểu và tạo được tiếng Anh cơ bản hay chưa. Không chỉ chọn đáp án — bạn sẽ nghe, đọc, xây câu và tự viết.',
  passing:{overall:75,requiredSections:{sentence:65,writing:60,reading:55,listening:55}},
  sections:[
    {
      id:'listening',labelVi:'Nghe hiểu',weight:20,
      items:[
        {id:'l1',type:'listenChoice',audio:'My name is Anna. I am twenty years old.',promptVi:'Anna bao nhiêu tuổi?',options:['18','20','22','30'],answer:'20'},
        {id:'l2',type:'listenChoice',audio:'The book is on the table.',promptVi:'Cuốn sách ở đâu?',options:['in the box','on the table','under the chair','at school'],answer:'on the table'},
        {id:'l3',type:'listenChoice',audio:'She studies English every evening.',promptVi:'Cô ấy làm gì mỗi tối?',options:['works','studies English','plays soccer','cooks'],answer:'studies English'},
        {id:'l4',type:'listenChoice',audio:'There are two apples in the bag.',promptVi:'Có bao nhiêu quả táo?',options:['one','two','three','four'],answer:'two'},
      ],
    },
    {
      id:'meaning',labelVi:'Từ và ý nghĩa',weight:15,
      items:[
        {id:'v1',type:'choice',promptVi:'“tired” gần nghĩa nhất với từ nào?',options:['mệt','đói','đẹp','nhanh'],answer:'mệt'},
        {id:'v2',type:'choice',promptVi:'Cụm nào có nghĩa “cuốn sách của tôi”?',options:['my book','book my','I book','me book'],answer:'my book'},
        {id:'v3',type:'choice',promptVi:'“next to” thường nói về điều gì?',options:['thời gian quá khứ','vị trí bên cạnh','số lượng','khả năng'],answer:'vị trí bên cạnh'},
        {id:'v4',type:'choice',promptVi:'Câu nào nói về khả năng?',options:['I can swim.','I am a student.','I have a book.','I live here.'],answer:'I can swim.'},
      ],
    },
    {
      id:'sentence',labelVi:'Xây câu & ngữ pháp',weight:25,
      items:[
        {id:'s1',type:'choice',promptVi:'Chọn câu đúng.',options:['She work every day.','She works every day.','She working every day.','She is work every day.'],answer:'She works every day.'},
        {id:'s2',type:'text',promptVi:'Sửa toàn bộ câu: “He does not likes coffee.”',accepted:['He does not like coffee.','He doesn’t like coffee.']},
        {id:'s3',type:'text',promptVi:'Xây câu hỏi đúng từ ý này: “she / live here”',accepted:['Does she live here?']},
        {id:'s4',type:'choice',promptVi:'Câu nào dùng a/an đúng?',options:['a apple','an apple','an university','a hour'],answer:'an apple'},
        {id:'s5',type:'choice',promptVi:'Chọn câu đúng.',options:['There is two books.','There are two books.','There two books are.','There have two books.'],answer:'There are two books.'},
        {id:'s6',type:'choice',promptVi:'Chọn câu đúng.',options:['These is my shoes.','This are my shoes.','These are my shoes.','Those is my shoes.'],answer:'These are my shoes.'},
      ],
    },
    {
      id:'reading',labelVi:'Đọc hiểu',weight:15,
      passage:'My name is Lan. I am a student. I live with my family. I have one brother. I study English every day. My brother works at a restaurant. On Sunday, we usually eat lunch together.',
      items:[
        {id:'r1',type:'choice',promptVi:'Lan là gì?',options:['teacher','student','doctor','cook'],answer:'student'},
        {id:'r2',type:'choice',promptVi:'Lan có bao nhiêu anh/em trai?',options:['0','1','2','3'],answer:'1'},
        {id:'r3',type:'choice',promptVi:'Ai làm việc ở nhà hàng?',options:['Lan','Lan’s brother','Lan’s mother','Lan’s teacher'],answer:'Lan’s brother'},
        {id:'r4',type:'choice',promptVi:'Gia đình thường làm gì vào Chủ nhật?',options:['study English','work at school','eat lunch together','play tennis'],answer:'eat lunch together'},
      ],
    },
    {
      id:'speaking',labelVi:'Nói thử (không chặn kết quả)',weight:0,optional:true,
      items:[
        {id:'sp1',type:'speaking',promptVi:'Nói câu này thành tiếng. Phần này dùng để luyện và ghi nhận transcript, chưa dùng để quyết định đậu/rớt A0.',target:'I study English every day.'},
      ],
    },
    {
      id:'writing',labelVi:'Tự viết',weight:25,
      items:[
        {id:'w1',type:'writing',promptVi:'Viết 8–10 câu về bản thân. Cố gắng dùng: am/is/are, Present Simple, have/has, một câu phủ định, một từ mô tả và một từ chỉ vị trí/thời gian.',minLines:8,minWords:28},
      ],
    },
  ],
}

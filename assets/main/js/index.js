/**
 * 元数据绑定的管理架构，页面互动管理
 * @type {Object}
 */
var metaData = {
	/**
	 * 初始化工作
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	init : function(meta){
		//做很多初始化的工作
		this.reset(meta);//调用重置数据的方法
	},
	/**
	 * 将用户传入的meta元数据对象重置到metaData来，交由管理
	 * @param  {[type]} meta [description]
	 * @return {[type]}      [description]
	 */
	reset : function(meta){
		//解析meta元数据，填充到对应模块
		if(meta.detail){
			this.detail.load = true;//数据加载开关打开
			this.detail.data = meta.detail;//把meta.detail数据复制给当前detail模块的data
		}
		if(meta.list){
			this.list.load = true;
			this.list.data = meta.list;
		}
		if(meta.tabs){
			if(meta.tabs.invest){
				this.invest.load = true;
				this.invest.data = meta.tabs.invest;
			}
			// if(meta.tabs.flow){
			// 	this.flow.load = true;
			// 	this.flow.data = meta.tabs.flow;
			// }
			// if(meta.tabs.forecast){
			// 	this.forecast.load = true;
			// 	this.forecast.data = meta.tabs.forecast;
			// }
			// if(meta.tabs.overview){
			// 	this.overview.load = true;
			// 	this.overview.data = meta.tabs.overview;
			// }
		}
		this.refresh();
	},
	/**
	 * 根据模块开关刷新页面模块
	 * @return {[type]} [description]
	 */
	refresh : function(){
		var module;//对应模块
		for(var moduleName in this){
			module = this[moduleName];//迭代所有metaData中的属性
			if(module.load){
				module.before&&module.before(this);//调用模块渲染之前的方法
				module.draw(this);//调用模块渲染方法
				module.after&&module.after(this);//调用模块渲染之后的方法
				module.load = false;//关闭刷新按钮
			}
		}
	},
	/**
	 * 条件模块
	 * @type {Object}
	 */
	dimensions : {

	},
	detail : {
		load : false,//当前模块是否已经加载【懒加载标识符】
		data : undefined,
		//绘制之前调用
		before : function(metaData){
			console.log("module[detail] before draw...");
		},
		//绘制该模块页面【根据detail对象的data数据进行绘制】
		draw : function(metaData){
			for(var prop in this.data){
				$("#"+prop).text(this.data[prop]);
			}
		},
		//绘制之后调用
		after : function(metaData){
			console.log("module[detail] after draw...");
		}
	},
	list : {
		load : false,
		data : undefined,
		before : function(metaData){
			$("#billList tbody").empty();
			//loading show
		},
		draw : function(metaData){
			var $tbody = $("#billList tbody");
			this.data.result = this.data.result||[];
			metaData.dimensions["entity.pageNo"] = this.data.pageNo;
			metaData.dimensions["entity.pageSize"] = this.data.pageSize;
			metaData.dimensions["entity.totalPage"] = this.data.totalPage;
			var row,m1,m2;
			if(this.data.result.length == 0) $(".lazy-load").hide();
			for(var i=0;i<this.data.result.length;i++){
				row = this.data.result[i];
				m1 = formatMoney(row.faceAmt);
				m2 = formatMoney(row.subscriptionAmt);
				$tbody.append("<tr>"+
							        "<td><span data-stopPropagation class=\"ico inp-check\" id=\"r"+row.id+"\"></span><input type=\"checkbox\" style=\"display:none\" value=\""+row.id+"\"></td>"+
							        //"<td><a href=\"" + ROOT +  "/invest/billInfo?id=" + row.productInfoId + "\" target=\"_blank\">"+row.billNo+"</a></td>"+
							        "<td>"+row.billNo+"</td>" +
							        "<td>"+row.acceptBankName+"</td>"+
							        "<td>"+formatePercent(row.discountRate)+"%</td>"+
							        "<td>"+m1.number+m1.unit+"</td>"+
							        "<td>"+m2.number+m2.unit+"</td>"+
							        "<td>"+row.remainDeadline+"</td>"+
							        "<td>"+new Date(row.accountDate).toLocaleDateString()+"</td>"+
								   "</tr>");
			}
		},
		after : function(metaData){
			console.log("module[list] after draw...");
			//loading hide
		}
	},
	invest : {
		load : false,
		data : undefined,
		before : function(metaData){
			console.log("module[invest] before draw...");
		},
		draw : function(metaData){
			// 基于准备好的dom，初始化echarts实例
	        var myChart = echarts.init(document.getElementById('tab1-pie1'));
	        var source = this.data.pie1;
	        var legend = [],series = [];

	        for(var key in source){
	        	legend.push(key);
	        	series.push({value:source[key], name:key});
	        }
	        // 指定图表的配置项和数据
	        var option = {
			    tooltip: {
			        trigger: 'item',
			        formatter: "{a} <br/>{b}: {c} ({d}%)"
			    },
			    legend: {
			        orient: 'vertical',
			        x: 'left',
			        data:legend
			    },
			    series: [
			        {
			            name:'承兑行资金比例',
			            type:'pie',
			            radius: ['50%', '70%'],
			            avoidLabelOverlap: false,
			            label: {
			                normal: {
			                    show: false,
			                    position: 'center'
			                },
			                emphasis: {
			                    show: true,
			                    textStyle: {
			                        fontSize: '30',
			                        fontWeight: 'bold'
			                    }
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            },
			            data:series
			        }
			    ]
			};
	        // 使用刚指定的配置项和数据显示图表。
	        myChart.setOption(option);
		},
		after : function(metaData){
			console.log("module[invest] after draw...");
		}
	}
};
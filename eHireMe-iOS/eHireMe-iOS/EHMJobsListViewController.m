//
//  EHMJobsListViewController.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/22/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "EHMJobsListViewController.h"

@interface EHMJobsListViewController () <UITableViewDataSource, UITableViewDelegate>

@end

@implementation EHMJobsListViewController

-(void)viewDidLoad {
    self.tableView.delegate = self;
    self.tableView.dataSource = self;
}

#pragma mark - UITableView Delegates and Datasource

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return 15;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"JobCell" forIndexPath:indexPath];
    
    cell.textLabel.tintColor = [UIColor blackColor];
    
    cell.textLabel.text = [NSString stringWithFormat:@"Job #%li", (long)indexPath.row];
    cell.detailTextLabel.text = [NSString stringWithFormat:@"Location #%li", (long)indexPath.row];
    
    return cell;
}

@end
